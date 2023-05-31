import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ChipSetModule } from '@/features/chipSet';
import { PlayerModule } from '@/features/player';
import { AuthModule } from '@/auth/auth.module';

import { allResolvers } from './resolvers';
import { allServices } from './services';
import { allLoaders } from './loaders';

import { ChipEntity } from './schema';

@Module({
  imports: [
    forwardRef(() => ChipSetModule),
    forwardRef(() => AuthModule),
    forwardRef(() => PlayerModule),

    TypeOrmModule.forFeature([ChipEntity]),
  ],
  providers: [...allServices, ...allLoaders, ...allResolvers],
  exports: allServices,
})
export class ChipModule {}
