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
  UseInterceptors,
} from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentV2Dto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { RequestType } from 'src/types/Request.type';
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
@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Get()
  @ApiOkResponse({ description: 'OK' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  findAll(@Request() request: RequestType) {
    return this.appointmentsService.findMany(request.user.id);
  }

  @Get('user/:id')
  @ApiOkResponse({ description: 'OK' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  findMany(@Param('id') id: number) {
    return this.appointmentsService.findMany(id);
  }

  @Get('doctor/:id')
  @ApiOkResponse({ description: 'OK' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  findManyByDoctor(@Param('id') id: string) {
    return this.appointmentsService.findManyByDoctor(id);
  }

  @Get('patient/:id')
  @ApiOkResponse({ description: 'OK' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  findManyByPatient(@Param('id') id: string) {
    return this.appointmentsService.findManyByPatient(id);
  }

  @Get(':id')
  @ApiOkResponse({ description: 'OK' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  findOne(@Param('id') id: number) {
    return this.appointmentsService.findOne(id);
  }

  @Post()
  @ApiCreatedResponse({ description: 'Created' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @UseInterceptors(FileInterceptor('image'))
  create(
    @Request() request: RequestType,
    @UploadedFile() image: Express.Multer.File,
    @Body() createAppointmentDto: CreateAppointmentV2Dto
  ) {
    return this.appointmentsService.create(request.user.id, image, createAppointmentDto);
  }

  @Patch(':id')
  @ApiOkResponse({ description: 'OK' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  update(
    @Param('id') id: number,
    @Request() request: RequestType,
    @Body() updateAppointmentDto: UpdateAppointmentDto
  ) {
    return this.appointmentsService.update(id, request, updateAppointmentDto);
  }

  @Delete(':id')
  @ApiOkResponse({ description: 'OK' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  remove(@Param('id') id: number, @Request() request: RequestType) {
    return this.appointmentsService.remove(id, request);
  }
}
