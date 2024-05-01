import { Test, TestingModule } from '@nestjs/testing';
import { SkinImagesService } from './skin-images.service';

describe('SkinImagesService', () => {
  let service: SkinImagesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SkinImagesService],
    }).compile();

    service = module.get<SkinImagesService>(SkinImagesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
