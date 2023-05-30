import { FeatureRepository } from '@/util/root.types';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { In, Repository } from 'typeorm';
import { UUID } from 'crypto';

import { ChipEntity } from './chip.db.entity';
import { Chip } from './chip.domain.object';

@Injectable()
export class ChipRepository implements FeatureRepository<Chip> {
  constructor(
    @InjectRepository(ChipEntity)
    private chipDsRepository: Repository<ChipEntity>,
  ) {}

  async getAll(): Promise<ChipEntity[]> {
    return this.chipDsRepository.find();
  }

  async getOneById(id: number): Promise<ChipEntity> {
    const many = await this.getManyByIds([id]);

    return many[0];
  }

  async getOneByOpaqueId(opaqueId: UUID): Promise<ChipEntity> {
    return this.chipDsRepository.findOneBy({ opaqueId });
  }

  async getManyByIds(ids: readonly number[]): Promise<ChipEntity[]> {
    return this.chipDsRepository.findBy({ id: In(ids) });
  }

  async getManyForChipSetById(id: number): Promise<ChipEntity[]> {
    return this.getManyForChipSetsByIds([id]);
  }

  async getManyForChipSetsByIds(ids: readonly number[]): Promise<ChipEntity[]> {
    return this.chipDsRepository.findBy({
      chipSet: { id: In(ids) },
    });
  }

  async getManyForChipSetsByOpaqueIds(
    opaqueIds: readonly UUID[],
  ): Promise<ChipEntity[]> {
    return this.chipDsRepository.findBy({
      chipSet: { opaqueId: In(opaqueIds) },
    });
  }
}
