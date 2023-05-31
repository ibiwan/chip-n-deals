import { FeatureRepository } from '@/types';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { In, Repository } from 'typeorm';
import { UUID } from 'crypto';

import { Chip, ChipEntity } from '../schema';

@Injectable()
export class ChipRepository implements FeatureRepository<Chip> {
  constructor(
    @InjectRepository(ChipEntity)
    private chipDsRepository: Repository<ChipEntity>,
  ) {}

  async getAll(): Promise<ChipEntity[]> {
    console.log('chip.repository.getAll');
    return this.chipDsRepository.find();
  }

  async oneById(id: number): Promise<ChipEntity> {
    console.log('chip.repository.oneById');
    const many = await this.getManyByIds([id]);

    return many[0];
  }

  async oneByOid(opaqueId: UUID): Promise<ChipEntity> {
    console.log('chip.repository.oneByOid');
    return this.chipDsRepository.findOneBy({ opaqueId });
  }

  async getManyByIds(ids: readonly number[]): Promise<ChipEntity[]> {
    console.log('chip.repository.getManyByIds');
    return this.chipDsRepository.findBy({ id: In(ids) });
  }

  async getManyForChipSetById(id: number): Promise<ChipEntity[]> {
    console.log('chip.repository.getManyForChipSetById');
    return this.getManyForChipSetsByIds([id]);
  }

  async getManyForChipSetsByIds(ids: readonly number[]): Promise<ChipEntity[]> {
    console.log('chip.repository.getManyForChipSetsByIds');
    return this.chipDsRepository.findBy({
      chipSet: { id: In(ids) },
    });
  }

  async getManyForChipSetsByOpaqueIds(
    opaqueIds: readonly UUID[],
  ): Promise<ChipEntity[]> {
    console.log('chip.repository.getManyForChipSetsByOpaqueIds');
    return this.chipDsRepository.findBy({
      chipSet: { opaqueId: In(opaqueIds) },
    });
  }
}
