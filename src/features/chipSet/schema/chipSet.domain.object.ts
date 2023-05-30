import { UUID } from 'crypto';

import { DomainObject, OwnableObject } from '@/util/root.types';

import { Player } from '@/features/player';
import { Chip } from '@/features/chip';

import { ChipSetCore } from './chipSet.core';

export class ChipSet
  implements ChipSetCore, DomainObject, OwnableObject<ChipSet>
{
  constructor(
    name: string,
    id: number,
    opaqueId: UUID,
    chips: Chip[] = null,
    owner: Player = null,
  ) {
    this.name = name;
    this.id = id;
    this.opaqueId = opaqueId;
    this.chips = chips;
    this.owner = owner;
  }

  name: string;
  id: number;
  opaqueId: UUID;
  chips: Chip[];
  owner: Player;
}
