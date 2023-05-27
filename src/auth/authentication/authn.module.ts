import { Module, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';

import { PlayerModule } from '@/features/player/player.module';

import { AuthController } from './authn.controller';
import { AuthService } from './authn.service';

@Module({
  imports: [
    ConfigModule,
    JwtModule.register({
      global: true,
      signOptions: { expiresIn: '30s' },
    }),
    forwardRef(() => PlayerModule),
  ],
  providers: [AuthService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthenticationModule {}
