import { Body, Controller, Post, Request, Res } from '@nestjs/common';
import { type Response } from 'express';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { SignInDto } from 'src/users/dto/sign-in.dto';
import { Public } from './decorators/public.decorator';
import { RequestType } from 'src/types/Request.type';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
} from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService
  ) {}

  @Public()
  @Post('sign-up')
  @ApiCreatedResponse({ description: 'Created' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  async signUp(@Body() registerUserDto: CreateUserDto) {
    return this.usersService.create(registerUserDto);
  }

  @Public()
  @Post('sign-in')
  @ApiCreatedResponse({ description: 'Created' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  async signIn(@Res({ passthrough: true }) res: Response, @Body() signInDto: SignInDto) {
    const tokens = await this.authService.signIn(signInDto);

    res.cookie('Authorization', `Bearer ${tokens.accessToken}`, { httpOnly: true, maxAge: 900000 });
    res.cookie('Refresh', tokens.refreshToken, { httpOnly: true, maxAge: 604800000 });

    return tokens;
  }

  @Post('logout')
  @ApiOkResponse({ description: 'OK' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('Authorization');
    res.clearCookie('Refresh');
  }

  @Public()
  @Post('refresh-token')
  @ApiCreatedResponse({ description: 'Created' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  async refresh(@Request() req: RequestType, @Res({ passthrough: true }) res: Response) {
    const refreshToken = req.cookies['Refresh'];
    if (!refreshToken) {
      console.log('No refresh token');
      res.clearCookie('Authorization');
      res.clearCookie('Refresh');
      return res.sendStatus(403);
    }

    const isExpired = await this.authService.isExpired(refreshToken);
    if (isExpired) {
      res.clearCookie('Authorization');
      res.clearCookie('Refresh');
      return res.sendStatus(403);
    }

    const newTokens = await this.authService.refresh(refreshToken);
    res.cookie('Authorization', `Bearer ${newTokens.accessToken}`, {
      httpOnly: true,
      maxAge: 900000,
    });
    res.cookie('Refresh', newTokens.refreshToken, { httpOnly: true, maxAge: 604800000 });

    return newTokens;
  }
}
