import { Body, Controller, Delete, Get, Param, Patch, Post, Request } from '@nestjs/common';
import { ConsultationsService } from './consultations.service';
import { CreateConsultationDto } from './dto/create-consultation.dto';
import { UpdateConsultationDto } from './dto/update-consultation.dto';
import { RequestType } from 'src/types/Request.type';
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
@Controller('consultations')
export class ConsultationsController {
  constructor(private readonly consultationsService: ConsultationsService) {}

  @Get()
  @ApiOkResponse({ description: 'OK' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  findAll(@Request() request: RequestType) {
    return this.consultationsService.findMany(request.user.id);
  }

  @Get('user/:id')
  @ApiOkResponse({ description: 'OK' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  findMany(@Param('id') id: number) {
    return this.consultationsService.findMany(id);
  }

  @Get('patient/:id')
  @ApiOkResponse({ description: 'OK' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  findManyByPatient(@Param('id') id: number) {
    return this.consultationsService.findManyByPatient(id);
  }

  @Get('doctor/:id')
  @ApiOkResponse({ description: 'OK' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  findManyByDoctor(@Param('id') id: number) {
    return this.consultationsService.findManyByDoctor(id);
  }

  @Get(':id')
  @ApiOkResponse({ description: 'OK' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  findOne(@Param('id') id: number) {
    return this.consultationsService.findOne(id);
  }

  @Post()
  @ApiCreatedResponse({ description: 'Created' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  create(@Body() createConsultationDto: CreateConsultationDto) {
    return this.consultationsService.create(createConsultationDto);
  }

  @Patch(':id')
  @ApiOkResponse({ description: 'OK' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  update(
    @Param('id') id: number,
    @Request() request: RequestType,
    @Body() updateConsultationDto: UpdateConsultationDto
  ) {
    return this.consultationsService.update(id, request, updateConsultationDto);
  }

  @Delete(':id')
  @ApiOkResponse({ description: 'OK' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  remove(@Param('id') id: number, @Request() request: RequestType) {
    return this.consultationsService.remove(id, request);
  }
}
