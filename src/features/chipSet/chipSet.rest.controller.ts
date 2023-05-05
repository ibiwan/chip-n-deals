import { ChipSetEntityModel } from '@/features/chipSet/chipSet.entityModel';
import { Controller, Get } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { randomUUID } from 'crypto';
import { EntityManager, Repository } from 'typeorm';
import { ChipEntityModel } from '../chip/chip.entityModel';

@Controller()
export class ChipSetController {
  constructor(
    @InjectEntityManager()
    private em: EntityManager,

    @InjectRepository(ChipSetEntityModel)
    private chipSetRepository: Repository<ChipSetEntityModel>,
  ) { }

  @Get('populate')
  populate() {
    const cs = new ChipSetEntityModel();
    cs.name = 'yo';
    cs.opaqueId = randomUUID();
    cs.chips = [];

    const someData: [string, number][] = [
      ['white', 57],
      ['red', 3],
      ['purple', 0.5],
    ];
    for (let [color, value] of someData) {
      const c = new ChipEntityModel();
      c.color = color;
      c.value = value;
      c.chipSet = cs;

      cs.chips.push(c);
    }
    this.em.save(cs);

    return 'ok';
  }
}
