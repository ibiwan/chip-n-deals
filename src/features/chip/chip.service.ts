import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UUID } from "crypto";

import { ChipSetEntityModel } from "@/features/chipSet/chipSet.entityModel";

import { ChipEntityModel } from "./chip.entityModel";

@Injectable()
export class ChipService {
  constructor(
    @InjectRepository(ChipEntityModel)
    private chipRepository: Repository<ChipEntityModel>,

    @InjectRepository(ChipSetEntityModel)
    private chipSetRepository: Repository<ChipSetEntityModel>,
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
}
