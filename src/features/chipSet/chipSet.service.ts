import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { UUID } from 'crypto';
import { Repository } from 'typeorm';

import { ChipSetEntityModel } from './chipSet.entityModel';

@Injectable()
export class ChipSetService {
  constructor(
    @InjectRepository(ChipSetEntityModel)
    private chipSetRepository: Repository<ChipSetEntityModel>,
  ) { }

  async chipSet(opaqueId: UUID) {
    return this.chipSetRepository.findOneBy({ opaqueId })
  }
}
