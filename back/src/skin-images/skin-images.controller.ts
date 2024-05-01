import { Body, Controller, Get, Param, Post, Request, UseGuards } from '@nestjs/common';
import { SkinImagesService } from './skin-images.service';
import { CreateSkinImageDto } from './dto/create-skin-image.dto';
import { RequestType } from 'src/types/Request.type';
import { RoleGuard } from 'src/auth/guards/roles.guard';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiHeader,
  ApiNotFoundResponse,
  ApiOkResponse,
} from '@nestjs/swagger';

@ApiHeader({
  name: 'Bearer',
  description: 'the token we need for auth',
})
@ApiForbiddenResponse({ description: 'Forbidden' })
@Controller('skin-images')
export class SkinImagesController {
  constructor(private readonly skinImagesService: SkinImagesService) {}

  @UseGuards(RoleGuard(['patient']))
  @Get()
  @ApiOkResponse({ description: 'OK' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  findAll(@Request() request: RequestType) {
    return this.skinImagesService.findMany({ user_id: request.user.id }, true);
  }

  @UseGuards(RoleGuard(['admin', 'doctor', 'dermatologist', 'patient']))
  @Get('user/:id')
  @ApiOkResponse({ description: 'OK' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  findManyByUser(@Param('id') id: number) {
    return this.skinImagesService.findMany({ user_id: id });
  }

  @UseGuards(RoleGuard(['admin', 'doctor', 'dermatologist']))
  @Get('consultation/:id')
  @ApiOkResponse({ description: 'OK' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  findManyByConsultation(@Param('id') id: number) {
    return this.skinImagesService.findMany({ consultation_id: id });
  }

  @Get(':id')
  @ApiOkResponse({ description: 'OK' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  findOne(@Param('id') id: number) {
    return this.skinImagesService.findOne(id);
  }

  @UseGuards(RoleGuard(['patient']))
  @Post()
  @ApiCreatedResponse({ description: 'Created' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  create(@Request() request: RequestType, @Body() createSkinImageDto: CreateSkinImageDto) {
    return this.skinImagesService.create(request.user.id, createSkinImageDto);
  }
}
