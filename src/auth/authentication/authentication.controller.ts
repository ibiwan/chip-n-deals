import {
  Controller,
  HttpStatus,
  HttpCode,
  Logger,
  Body,
  Post,
} from '@nestjs/common';

import { Public } from '@/util/auth.util';

import { AuthorizationService } from '../authorization/authorization.service';

@Controller('auth')
export class AuthenticationController {
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
