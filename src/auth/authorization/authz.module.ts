import { APP_GUARD } from '@nestjs/core';
import { Module, forwardRef } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { PlayerModule } from '@/features/player';

import { AuthGuard } from './authz.endpoint.guard';

@Module({
  imports: [forwardRef(() => ConfigModule), forwardRef(() => PlayerModule)],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AuthorizationModule {}
