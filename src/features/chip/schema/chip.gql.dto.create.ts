import { UUID } from 'crypto';

import { Field, InputType } from '@nestjs/graphql';
import { ChipCore } from './chip.core.js';
import { Chip } from './chip.domain.object.js';
import { ChipSet } from '@/features/chipSet/schema/chipSet.domain.object.js';
import { Player } from '@/features/player/schema/player.domain.object.js';

@InputType('CreateChipInput')
export class CreateChipDto implements ChipCore {
  @Field()
  color: string;

  @Field()
  value: number;

  @Field(/* istanbul ignore next */ () => String, {
    nullable: true,
  })
  chipSetOpaqueId?: UUID;
}

export function chipCreateDtoToDomainObject(
  chipDto: CreateChipDto,
  chipSet: ChipSet,
  owner: Player,
): Chip {
  return new Chip(chipDto.color, chipDto.value, null, null, chipSet, owner);
}
