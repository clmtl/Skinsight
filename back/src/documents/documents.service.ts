import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PatientDocument } from './entities/document.entity';
import { Repository } from 'typeorm';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { RequestType } from 'src/types/Request.type';
import { randomImageName } from 'src/utils/images';
import { GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import { s3 } from 'src/s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

@Injectable()
export class DocumentsService {
  constructor(
    @InjectRepository(PatientDocument)
    private readonly documentRepository: Repository<PatientDocument>
  ) {}

  async findMany(id: number) {
    const documents = await this.documentRepository.find({
      where: { user_id: id },
      relations: ['user'],
    });

    // Generate signed URL for each document
    const urls = await Promise.all(
      documents.map(async (document) => {
        const getObjectParams = {
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: document.document_path,
        };

        const getCommand = new GetObjectCommand(getObjectParams);
        const url = await getSignedUrl(s3, getCommand, { expiresIn: 3600 });

        return { ...document, document_path: url };
      })
    );

    return urls;
  }

  async findOne(id: number) {
    const document = await this.documentRepository.findOne({ where: { id }, relations: ['user'] });
    return document;
  }

  async create(userId: number, image: Express.Multer.File) {
    const imageName = randomImageName();
    // Save image to s3
    const putParams = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: imageName,
      Body: image.buffer,
      ContentType: image.mimetype,
    };

    const putCommand = new PutObjectCommand(putParams);

    await s3.send(putCommand).catch((error) => {
      throw new Error(error);
    });

    const documentToCreate = {
      document_path: imageName,
      document_name: image.originalname,
      document_type: image.mimetype,
      user_id: userId,
    };

    const document = this.documentRepository.create(documentToCreate);
    return this.documentRepository.save(document);
  }

  async update(id: number, request: RequestType, updateDocumentDto: UpdateDocumentDto) {
    const userId = request.user.id;
    const document = await this.documentRepository.preload({
      id: +id,
      ...updateDocumentDto,
    });
    if (!document) {
      throw new Error(`Document #${id} not found`);
    }
    if (document.user_id !== userId && request.user.role !== 'admin') {
      throw new Error(`User not allowed to update this document`);
    }
    return this.documentRepository.save(document);
  }

  async remove(id: number, request: RequestType) {
    const userId = request.user.id;
    const document = await this.findOne(id);
    if (!document) {
      throw new Error(`Document #${id} not found`);
    }
    if (document.user_id !== userId && request.user.role !== 'admin') {
      throw new Error(`User not allowed to remove this document`);
    }
    return this.documentRepository.remove(document);
  }
}
