import { Field, InputType } from '@nestjs/graphql';

import { CreateChipDto } from '@/features/chip/schema/chip.gql.dto.create';

import { ChipSetCore } from './chipset.core';
import { Player } from '@/features/player/schema/player.domain.object';
import { ChipSet } from './chipSet.domain.object';

@InputType('CreateChipSetInput')
export class CreateChipSetDto implements ChipSetCore {
  @Field() name: string;
  @Field(() => [CreateChipDto]) chips: CreateChipDto[];

  toDomainObject(owner: Player): ChipSet {
    const chipSet = new ChipSet(this.name, null, null, null, owner);
    chipSet.chips = this.chips.map((chip) =>
      chip.toDomainObject(chipSet, owner),
    );
    return chipSet;
  }
}
