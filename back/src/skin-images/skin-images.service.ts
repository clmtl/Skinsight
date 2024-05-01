import { Injectable, NotFoundException, Request } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SkinImage } from './entities/skin-image.entity';
import { Repository } from 'typeorm';
import { CreateSkinImageDto } from './dto/create-skin-image.dto';
import Replicate from 'replicate';
import { AiAnalysisService } from 'src/ai-analysis/ai-analysis.service';
import { GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { s3 } from 'src/s3';

@Injectable()
export class SkinImagesService {
  constructor(
    @InjectRepository(SkinImage)
    private readonly skinImageRepository: Repository<SkinImage>,
    private readonly aiAnalysisService: AiAnalysisService
  ) {}

  async findMany(
    selector: { user_id?: number; consultation_id?: number },
    isPatient: boolean = false
  ) {
    const skinImages = await this.skinImageRepository.find({
      where: selector,
      relations: ['ai_analysis'],
    });
    if (!skinImages) throw new NotFoundException(`Images not found`);

    // Generate signed URL for each document
    const urls = await Promise.all(
      skinImages.map(async (image) => {
        const getObjectParams = {
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: image.image_path,
        };

        const getCommand = new GetObjectCommand(getObjectParams);
        const url = await getSignedUrl(s3, getCommand, { expiresIn: 3600 });

        return { ...image, image_path: url };
      })
    );

    if (isPatient) {
      urls.forEach((image) => {
        delete image.ai_analysis;
      });
      return urls;
    }
    const good = [];
    const bad = [];
    const notAnalysed = [];
    urls.forEach((image) => {
      if (!image.ai_analysis) {
        notAnalysed.push(image);
      } else if (image.ai_analysis.analysis_result_good === true) {
        good.push(image);
      } else {
        bad.push(image);
      }
    });
    return { notAnalysed, good, bad };
  }

  async findOne(id: number) {
    const skinImage = await this.skinImageRepository.findOne({
      where: { id },
      relations: ['user', 'ai_analysis'],
    });
    if (!skinImage) throw new NotFoundException(`Image #${id} not found`);
    return skinImage;
  }

  async findSkinImagesByUserId(id: number) {
    const skinImages = await this.skinImageRepository.find({
      where: { user_id: id },
      relations: ['ai_analysis'],
    });
    if (!skinImages) throw new NotFoundException(`Image #${id} not found`);
    return skinImages;
  }

  async analyseSkinImage(path: string, image_id: number) {
    const replicate = new Replicate({
      auth: process.env.AI_TOKEN,
    });

    let count = 0;

    const symmetry: string | any = await replicate.run(
      'andreasjansson/blip-2:4b32258c42e9efd4288bb9910bc532a69727f9acd26aa08e175713a0a857a608',
      {
        input: {
          image: path,
          question:
            'Can you analyze the symmetry of this form and determine if it exhibits a degree of symmetry, albeit not perfectly symmetrical?',
        },
      }
    );

    if (!symmetry.includes('yes')) {
      count++;
    }

    const border: string | any = await replicate.run(
      'andreasjansson/blip-2:4b32258c42e9efd4288bb9910bc532a69727f9acd26aa08e175713a0a857a608',
      {
        input: {
          image: path,
          question:
            'Could you assess the borders of this mole and determine if they exhibit a degree of irregularity, albeit not entirely irregular?',
        },
      }
    );

    if (border.includes('yes')) {
      count++;
    }

    const color: string | any = await replicate.run(
      'andreasjansson/blip-2:4b32258c42e9efd4288bb9910bc532a69727f9acd26aa08e175713a0a857a608',
      {
        input: {
          image: path,
          question:
            'Can you determine if there are noticeable variations in colors in this form, with neither too few nor too many variations?',
        },
      }
    );

    if (color.includes('yes')) {
      count++;
    }

    const diameter: string | any = await replicate.run(
      'andreasjansson/blip-2:4b32258c42e9efd4288bb9910bc532a69727f9acd26aa08e175713a0a857a608',
      {
        input: {
          image: path,
          question: 'Is the mole larger than 6mm in diameter?',
        },
      }
    );

    if (diameter.includes('yes')) {
      count++;
    }

    const evolving: string | any = await replicate.run(
      'andreasjansson/blip-2:4b32258c42e9efd4288bb9910bc532a69727f9acd26aa08e175713a0a857a608',
      {
        input: {
          image: path,
          question:
            'Is the mole in the process of evolving towards different color or size or shape?',
        },
      }
    );

    if (evolving.includes('yes')) {
      count++;
    }

    const analysis_result_good = count > 3 ? false : true;

    this.aiAnalysisService.create({
      image_id,
      analysis_result_good,
    });
  }

  async create(userId, createSkinImageDto: CreateSkinImageDto) {
    // Save image to db
    const skinImageToCreate = {
      ...createSkinImageDto,
      user_id: userId,
    };

    const skinImage = this.skinImageRepository.create(skinImageToCreate);
    const image = await this.skinImageRepository.save(skinImage).catch((error) => {
      throw new Error(error);
    });

    // Get image pre-signed url from s3
    const getObjectParams = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: createSkinImageDto.image_path,
    };

    const getCommand = new GetObjectCommand(getObjectParams);
    const url = await getSignedUrl(s3, getCommand, { expiresIn: 3600 });

    // Analyse image
    this.analyseSkinImage(url, image.id);

    return image;
  }
}
