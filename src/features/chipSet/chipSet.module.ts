import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from '@/auth/auth.module';

import { PlayerModule } from '@/features/player';
import { ChipModule } from '@/features/chip';

import { allServices } from './services';
import { allLoaders } from './loaders';
import { allResolvers } from './resolvers';

import { ChipSetEntity } from './schema/chipSet.db.entity';

@Module({
  imports: [
    forwardRef(() => ChipModule),
    forwardRef(() => AuthModule),
    forwardRef(() => PlayerModule),
    TypeOrmModule.forFeature([ChipSetEntity]),
  ],
  providers: [...allLoaders, ...allResolvers, ...allServices],
  exports: allServices,
})
export class ChipSetModule {}
