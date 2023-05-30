import { UUID } from 'crypto';
import { Field, InputType } from '@nestjs/graphql';

import { ChipSet } from '@/features/chipSet';
import { Player } from '@/features/player';

import { ChipCore } from './chip.core.js';
import { Chip } from './chip.domain.object.js';

@InputType('CreateChipInput')
export class CreateChipDto implements ChipCore {
  @Field()
  color: string;

  @Field()
  value: number;

  @Field(() => String, {
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
