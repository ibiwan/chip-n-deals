import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Logger,
  Post,
} from '@nestjs/common';

import { Public } from '@/auth/auth.util';

import { AuthorizationService } from './authn.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthorizationService) {}

  private readonly logger = new Logger(this.constructor.name);

  /**
   *
   * @param signInDto
   * @returns
   */
  @HttpCode(HttpStatus.OK)
  @Post('login')
  @Public()
  signIn(@Body() signInDto: { username: string; password: string }) {
    this.logger.debug(`signIn: username = ${signInDto.username}`);

    return this.authService.signIn(signInDto.username, signInDto.password);
  }
}
