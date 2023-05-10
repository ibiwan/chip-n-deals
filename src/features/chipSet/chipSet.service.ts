import {
  Args,
  Parent,
} from '@nestjs/graphql';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { UUID } from 'crypto';
import { Repository } from 'typeorm';

import { ChipEntityModel } from '@/features/chip/chip.entityModel';

import { ChipSetEntityModel } from './chipSet.entityModel';

@Injectable()
export class ChipSetService {
  constructor(
    @InjectRepository(ChipEntityModel)
    private chipRepository: Repository<ChipEntityModel>,

    @InjectRepository(ChipSetEntityModel)
    private chipSetRepository: Repository<ChipSetEntityModel>,
  ) { }

  async chipSet(
    @Args('opaque_id', { type: () => String })
    opaqueId: UUID
  ) {
    return this.chipSetRepository.findOneBy({ opaqueId })
  }

  async chipSetById(id: number) {
    return this.chipSetRepository.findOneBy({ id })
  }

  async chips(@Parent() chipSet: ChipSetEntityModel) {
    return this.chipRepository.findBy({ chipSet })
  }
}
