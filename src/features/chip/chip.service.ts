import { Injectable } from "@nestjs/common";
import { InjectEntityManager, InjectRepository } from "@nestjs/typeorm";
import { EntityManager, Repository } from "typeorm";
import { UUID } from "crypto";

import { ChipSetEntityModel } from "@/features/chipSet/chipSet.entityModel";

import { ChipEntityModel, CreateChipDto } from "./chip.entityModel";
import { ChipSetService } from "../chipSet/chipSet.service";

@Injectable()
export class ChipService {
  constructor(
    @InjectRepository(ChipEntityModel)
    private chipRepository: Repository<ChipEntityModel>,

    @InjectRepository(ChipSetEntityModel)
    private chipSetRepository: Repository<ChipSetEntityModel>,

    private chipSetService: ChipSetService,

    @InjectEntityManager()
    private em: EntityManager,
  ) { }

  async allChips() {
    return this.chipRepository.find({
      relations: {
        chipSet: true
      }
    })
  }

  async chipsForChipSet(opaqueId: UUID) {
    const chipSet = await this.chipSetRepository.findOne({
      relations: {
        chips: { chipSet: true },
      },
      where: {
        opaqueId
      }
    })

    return chipSet.chips
  }

  async createChip(createChipDto: CreateChipDto) {
    const { color, value, chipSetOpaqueId } = createChipDto

    const chipSet = await this.chipSetService.chipSet(chipSetOpaqueId)

    const chip = new ChipEntityModel(
      color, value, chipSet
    )
    this.em.save(chip)

    return chip
  }
}
