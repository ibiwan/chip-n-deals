import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';

import { Public } from '@/auth/auth.util';

import { AuthService } from './authn.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  /**
   *
   * @param signInDto
   * @returns
   */
  @HttpCode(HttpStatus.OK)
  @Post('login')
  @Public()
  signIn(@Body() signInDto: { username: string; password: string }) {
    return this.authService.signIn(signInDto.username, signInDto.password);
  }
}
