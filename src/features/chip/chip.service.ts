import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ChipEntityModel } from "./chip.entityModel";
import { Repository } from "typeorm";
import { ChipSetEntityModel } from "../chipSet/chipSet.entityModel";
import { UUID } from "crypto";

@Injectable()
export class ChipService {
  constructor(
    @InjectRepository(ChipEntityModel)
    private chipRepository: Repository<ChipEntityModel>,

    @InjectRepository(ChipSetEntityModel)
    private chipSetRepository: Repository<ChipSetEntityModel>,
  ) { }

  async allChips() {
    return this.chipRepository.find()
  }

  async chipsForChipSet(opaqueId: UUID) {
    const chipSet = await this.chipSetRepository.findOne({
      relations: {
        chips: true
      },
      where: {
        opaqueId
      }
    })

    return chipSet.chips
  }
}
