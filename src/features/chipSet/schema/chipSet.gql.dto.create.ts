import { Field, InputType } from '@nestjs/graphql';

import { Player } from '@/features/player/schema/player.domain.object';
import { CreateChipDto, chipCreateDtoToDomainObject } from '@/features/chip';

import { ChipSetCore } from './chipSet.core';
import { ChipSet } from './chipSet.domain.object';

@InputType('CreateChipSetInput')
export class CreateChipSetDto implements ChipSetCore {
  @Field() name: string;
  @Field(() => [CreateChipDto]) chips: CreateChipDto[];
}

export function chipSetCreateDtoToDomainObject(
  chipSetDto: CreateChipSetDto,
  owner: Player,
): ChipSet {
  const chipSet = new ChipSet(chipSetDto.name, null, null, null, owner);
  chipSet.chips = chipSetDto.chips.map((chip) =>
    chipCreateDtoToDomainObject(chip, chipSet, owner),
  );
  return chipSet;
}
