import { Module, forwardRef } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';

import { Ownership } from '@/auth/authorization/authz.entity.guard';

import { ChipSetModule } from '@/features/chipSet/chipSet.module';
import { PlayerModule } from '@/features/player/player.module';
import { ChipModule } from '@/features/chip/chip.module';

import { FeatureDispatchService } from './feature.dispatch.service';
import { AuthorizationModule } from '../authorization/authz.module';
import { AuthenticationModule } from '../authentication/authn.module';

@Module({
  imports: [
    forwardRef(/* istanbul ignore next */ () => AuthenticationModule),
    forwardRef(/* istanbul ignore next */ () => AuthorizationModule),
    forwardRef(/* istanbul ignore next */ () => ChipSetModule),
    forwardRef(/* istanbul ignore next */ () => PlayerModule),
    forwardRef(/* istanbul ignore next */ () => ChipModule),
  ],
  providers: [
    FeatureDispatchService,
    {
      provide: APP_INTERCEPTOR,
      useClass: Ownership,
    },
  ],
  exports: [FeatureDispatchService],
})
export class OwnershipModule {}
