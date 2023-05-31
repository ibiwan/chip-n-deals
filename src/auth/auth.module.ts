import { Module, forwardRef } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';

import { TableModule } from '@/features/table/table.module';
import { ChipSetModule } from '@/features/chipSet';
import { PlayerModule } from '@/features/player';
import { ChipModule } from '@/features/chip';

import { AuthorizationEndpointGuard } from './authorization/authorization.endpoint.guard';
import { AuthenticationController } from './authentication/authentication.controller';
import { AuthorizationEntityGuard } from './authorization/authorization.entity.guard';
import { AuthorizationService } from './authorization/authorization.service';
import { FeatureDispatchService } from './ownership/feature.dispatch.service';

@Module({
  imports: [
    forwardRef(() => ChipSetModule),
    forwardRef(() => ConfigModule),
    forwardRef(() => PlayerModule),
    forwardRef(() => TableModule),
    forwardRef(() => ChipModule),

    JwtModule.register({
      global: true,
      signOptions: { expiresIn: '30s' },
    }),
  ],
  providers: [
    AuthorizationService,
    FeatureDispatchService,
    {
      provide: APP_INTERCEPTOR,
      useClass: AuthorizationEntityGuard,
    },
    {
      provide: APP_GUARD,
      useClass: AuthorizationEndpointGuard,
    },
  ],

  controllers: [AuthenticationController],
  exports: [AuthorizationService],
})
export class AuthModule {}
