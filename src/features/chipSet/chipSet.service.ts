import {
  Args,
  Parent,
} from '@nestjs/graphql';
import { ChipSetEntityModel } from './chipSet.entityModel';
import { UUID } from 'crypto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChipEntityModel } from '../chip/chip.entityModel';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ChipSetService {
  constructor(
    @InjectRepository(ChipEntityModel)
    private chipRepository: Repository<ChipEntityModel>,

    @InjectRepository(ChipSetEntityModel)
    private chipSetRepository: Repository<ChipSetEntityModel>,
  ) { }

  async chipSet(@Args('opaque_id', { type: () => String }) opaqueId: UUID) {
    return this.chipSetRepository.findOneBy({ opaqueId })
  }

  async chips(@Parent() chipSet:ChipSetEntityModel){
    return this.chipRepository.findBy({chipSet})
  }
}
