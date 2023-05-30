import { Module, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';

import { PlayerModule } from '@/features/player';

import { AuthController } from './authn.controller';
import { AuthorizationService } from './authn.service';

@Module({
  imports: [
    forwardRef(() => ConfigModule),
    JwtModule.register({
      global: true,
      signOptions: { expiresIn: '30s' },
    }),
    forwardRef(() => PlayerModule),
  ],
  providers: [AuthorizationService],
  controllers: [AuthController],
  exports: [AuthorizationService],
})
export class AuthenticationModule {}
