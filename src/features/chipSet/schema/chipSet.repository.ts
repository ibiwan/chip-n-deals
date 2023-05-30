import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { In, Repository } from 'typeorm';
import { UUID } from 'crypto';

import { FeatureRepository } from '@/util/root.types';

import { ChipSetEntity } from './chipSet.db.entity';
import { ChipSet } from './chipSet.domain.object';

@Injectable()
export class ChipSetRepository implements FeatureRepository<ChipSet> {
  constructor(
    @InjectRepository(ChipSetEntity)
    private chipSetDsRepository: Repository<ChipSetEntity>,
  ) {}

  async getAll(): Promise<ChipSetEntity[]> {
    return this.chipSetDsRepository.find();
  }

  async getOneById(id: number): Promise<ChipSetEntity> {
    const many = await this.getManyByIds([id]);

    return many[0];
  }

  async getOneByOpaqueId(opaqueId: UUID): Promise<ChipSetEntity> {
    return this.chipSetDsRepository.findOneBy({ opaqueId });
  }

  async getManyByIds(ids: readonly number[]): Promise<ChipSetEntity[]> {
    return this.chipSetDsRepository.findBy({ id: In(ids) });
  }
  async getManyByOpaqueIds(ids: readonly UUID[]): Promise<ChipSetEntity[]> {
    return this.chipSetDsRepository.findBy({ opaqueId: In(ids) });
  }
}
