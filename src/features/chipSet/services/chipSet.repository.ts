import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { In, Repository } from 'typeorm';
import { UUID } from 'crypto';

import { FeatureRepository } from '@/types';

import { ChipSet, ChipSetEntity } from '../schema';

@Injectable()
export class ChipSetRepository implements FeatureRepository<ChipSet> {
  constructor(
    @InjectRepository(ChipSetEntity)
    private chipSetDsRepository: Repository<ChipSetEntity>,
  ) {}

  async getAll(): Promise<ChipSetEntity[]> {
    console.log('chipSet.repository.getAll');
    return this.chipSetDsRepository.find();
  }

  async oneById(id: number): Promise<ChipSetEntity> {
    console.log('chipSet.repository.oneById');
    const many = await this.getManyByIds([id]);

    return many[0];
  }

  async oneByOid(opaqueId: UUID): Promise<ChipSetEntity> {
    console.log('chipSet.repository.oneByOid');
    return this.chipSetDsRepository.findOneBy({ opaqueId });
  }

  async getManyByIds(ids: readonly number[]): Promise<ChipSetEntity[]> {
    console.log('chipSet.repository.getManyByIds');
    return this.chipSetDsRepository.findBy({ id: In(ids) });
  }
  async getManyByOpaqueIds(ids: readonly UUID[]): Promise<ChipSetEntity[]> {
    console.log('chipSet.repository.getManyByOpaqueIds');
    return this.chipSetDsRepository.findBy({ opaqueId: In(ids) });
  }
}
