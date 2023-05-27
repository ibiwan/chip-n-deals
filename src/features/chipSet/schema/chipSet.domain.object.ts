import { UUID } from 'crypto';

import { DomainObject } from '@/util/root.types';

import { Chip } from '@/features/chip/schema/chip.domain.object';
import { OwnableObject } from '@/auth/ownership/ownable.interface';
import { ChipSetCore } from './chipset.core';
import { Player } from '@/features/player/schema/player.domain.object';

export class ChipSet implements ChipSetCore, DomainObject, OwnableObject {
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
