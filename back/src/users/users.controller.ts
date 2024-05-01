import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Request,
    UseGuards,
  } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { RequestType } from 'src/types/Request.type';
import { RoleGuard } from 'src/auth/guards/roles.guard';
import { ApiForbiddenResponse, ApiHeader, ApiNotFoundResponse, ApiOkResponse } from '@nestjs/swagger';

  @ApiHeader({
      name: 'Bearer',
      description: 'the token we need for auth'
  })
  @ApiOkResponse({ description: "OK" })
  @ApiNotFoundResponse({ description: "Not Found" })
  @ApiForbiddenResponse({ description: "Forbidden" })
  @Controller('users')
  export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @UseGuards(RoleGuard(['admin']))
    @Get('all')
    findAll() {
      return this.usersService.findAll();
    }

    @Get()
    findMany(@Request() request: RequestType) {
      return this.usersService.findMany(request);
    }

    @UseGuards(RoleGuard(['admin', 'user', 'dermatologist', 'doctor']))
    @Get(':id')
    findOne(@Param('id') id: number) {
      return this.usersService.findOne(id);
    }

    @UseGuards(RoleGuard(['admin', 'user']))
    @Patch(':id')
    update(@Param('id') id: number, @Body() updateUserDto : UpdateUserDto) {
      return this.usersService.update(id, updateUserDto);
    }

    @UseGuards(RoleGuard(['admin', 'user']))
    @Delete(':id')
    remove(@Param('id') id: number) {
      return this.usersService.remove(id);
    }
  }