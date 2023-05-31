import { Field, InputType } from '@nestjs/graphql';
import { UUID } from 'crypto';

import { ChipCore } from './chip.core.js';

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
