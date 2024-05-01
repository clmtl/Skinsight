import { Test, TestingModule } from '@nestjs/testing';
import { SkinImagesController } from './skin-images.controller';

describe('SkinImagesController', () => {
  let controller: SkinImagesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SkinImagesController],
    }).compile();

    controller = module.get<SkinImagesController>(SkinImagesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
