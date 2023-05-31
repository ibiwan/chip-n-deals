import { UUID } from 'crypto';

import { DomainObject, OwnableObject } from '@/types';

import { Player } from '@/features/player';
import { Chip } from '@/features/chip';

import { ChipSetCore } from './chipSet.core';
import { ChipSetMeta } from './chipSet.meta';

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

  static from(source: ChipSetMeta, fields: Record<string, any> = {}): ChipSet {
    const chipSet = Object.create(ChipSet.prototype);
    Object.assign(chipSet, source, fields);

    return chipSet;
  }
  name: string;
  id: number;
  opaqueId: UUID;
  chips: Chip[];
  owner: Player;
}
