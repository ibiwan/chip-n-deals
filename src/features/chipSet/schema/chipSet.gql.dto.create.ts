import { Field, InputType } from '@nestjs/graphql';

import { CreateChipDto } from '@/features/chip';

import { ChipSetCore } from './chipSet.core';

@InputType('CreateChipSetInput')
export class CreateChipSetDto implements ChipSetCore {
  @Field() name: string;
  @Field(() => [CreateChipDto]) chips: CreateChipDto[];
}
