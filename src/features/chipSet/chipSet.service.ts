import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { UUID } from 'crypto';
import { EntityManager, Repository } from 'typeorm';

import { ChipSetEntityModel } from './chipSet.entityModel';

@Injectable()
export class ChipSetService {
  constructor(
    @InjectRepository(ChipSetEntityModel)
    private chipSetRepository: Repository<ChipSetEntityModel>,

    @InjectEntityManager()
    private em: EntityManager,
  ) { }

  async chipSet(opaqueId: UUID) {
    return this.chipSetRepository.findOneBy({ opaqueId })
  }

  async createWithName(name:string){
    return this.em.save(
      new ChipSetEntityModel(name, [])
    )
  }
}
