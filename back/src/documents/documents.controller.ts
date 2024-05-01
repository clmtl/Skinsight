import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
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
import { FileInterceptor } from '@nestjs/platform-express';

@ApiHeader({
  name: 'Bearer',
  description: 'the token we need for auth',
})
@ApiForbiddenResponse({ description: 'Forbidden' })
@Controller('documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @UseGuards(RoleGuard(['patient']))
  @Get()
  @ApiOkResponse({ description: 'OK' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  findAll(@Request() request: RequestType) {
    return this.documentsService.findMany(request.user.id);
  }

  @UseGuards(RoleGuard(['admin', 'doctor', 'dermatologist']))
  @Get('user/:id')
  @ApiOkResponse({ description: 'OK' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  findMany(@Param('id') id: number) {
    return this.documentsService.findMany(id);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.documentsService.findOne(id);
  }

  @UseGuards(RoleGuard(['patient']))
  @Post()
  @ApiCreatedResponse({ description: 'Created' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @UseInterceptors(FileInterceptor('image'))
  create(@Request() request: RequestType, @UploadedFile() image: Express.Multer.File) {
    return this.documentsService.create(request.user.id, image);
  }

  @Patch(':id')
  @ApiOkResponse({ description: 'OK' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  update(
    @Param('id') id: number,
    @Request() request: RequestType,
    @Body() updateDocumentDto: UpdateDocumentDto
  ) {
    return this.documentsService.update(id, request, updateDocumentDto);
  }

  @Delete(':id')
  @ApiOkResponse({ description: 'OK' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  remove(@Param('id') id: number, @Request() request: RequestType) {
    return this.documentsService.remove(id, request);
  }
}
