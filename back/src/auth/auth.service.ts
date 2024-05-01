import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { SignInDto } from 'src/users/dto/sign-in.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService
  ) {}

  async signIn(signInDto: SignInDto) {
    const { email, password } = signInDto;

    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const passwordIsValid = await user.validatePassword(password);
    if (!passwordIsValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const validUser = await this.validateUser(email, password);

    const userId = validUser.id;

    const accessToken = this.getAccessToken({ id: userId });
    const refreshToken = this.getRefreshToken({ id: userId });

    return {
      accessToken,
      refreshToken,
    };
  }

  // async signOut(id: number) {
  //   const user = await this.usersService.findOne(id);
  //   if (!user) throw new UnauthorizedException(`User #${id} not found`);
  //   return 'Please log out.';
  // }

  getAccessToken(payload: { id: number }) {
    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_ACCESS_TOKEN_SECRET,
      expiresIn: +process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME,
    });
    return accessToken;
  }

  getRefreshToken(payload: { id: number }) {
    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_TOKEN_SECRET,
      expiresIn: +process.env.JWT_REFRESH_TOKEN_EXPIRATION_TIME,
    });
    return refreshToken;
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (user && (await user.validatePassword(password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async refresh(refreshToken: string) {
    const payload = this.jwtService.verify(refreshToken, {
      secret: process.env.JWT_REFRESH_TOKEN_SECRET,
    });

    const accessToken = this.getAccessToken({ id: payload.id });
    const newRefreshToken = this.getRefreshToken({ id: payload.id });

    return {
      accessToken,
      refreshToken: newRefreshToken,
    };
  }

  async isExpired(refreshToken: string) {
    try {
      this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_REFRESH_TOKEN_SECRET,
      });
      return false;
    } catch (error) {
      return true;
    }
  }
}
