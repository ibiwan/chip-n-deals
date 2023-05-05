import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ChipModule } from '@/features//chip/chip.module';
import { ChipSetEntityModel } from './chipSet.entityModel';
import { ChipSetController } from './chipSet.rest.controller';
import { ChipSetResolver } from './chipSet.resolver';
import { ChipEntityModel } from '../chip/chip.entityModel';
import { ChipSetService } from './chipSet.service';

@Module({
  imports: [
    ChipModule,
    TypeOrmModule.forFeature([ChipEntityModel, ChipSetEntityModel]),
  ],
  controllers: [ChipSetController],
  providers: [ChipSetResolver, ChipSetService],
}) 
export class ChipSetModule { }
