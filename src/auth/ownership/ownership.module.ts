import { Module, forwardRef } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';

import { EntityGuard } from '@/auth/authorization/authz.entity.guard';

import { ChipSetModule } from '@/features/chipSet';
import { PlayerModule } from '@/features/player';
import { ChipModule } from '@/features/chip';

import { FeatureDispatchService } from './feature.dispatch.service';
import { AuthorizationModule } from '../authorization/authz.module';
import { AuthenticationModule } from '../authentication/authn.module';

@Module({
  imports: [
    forwardRef(() => AuthenticationModule),
    forwardRef(() => AuthorizationModule),
    forwardRef(() => ChipSetModule),
    forwardRef(() => PlayerModule),
    forwardRef(() => ChipModule),
  ],
  providers: [
    FeatureDispatchService,
    {
      provide: APP_INTERCEPTOR,
      useClass: EntityGuard,
    },
  ],
  exports: [FeatureDispatchService],
})
export class OwnershipModule {}
