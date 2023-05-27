import { UUID } from 'crypto';

import { DomainObject } from '@/util/root.types';
import { OwnableObject } from '@/auth/ownership/ownable.interface';
import { ChipSet } from '@/features/chipSet/schema/chipSet.domain.object';
import { ChipCore } from './chip.core';
import { Player } from '@/features/player/schema/player.domain.object';

export class Chip implements ChipCore, DomainObject, OwnableObject {
  constructor(
    color: string,
    value: number,
    id: number,
    opaqueId: UUID,
    chipSet: ChipSet,
    owner: Player,
  ) {
    this.color = color;
    this.value = value;
    this.id = id;
    this.opaqueId = opaqueId;
    this.chipSet = chipSet;
    this.owner = owner;
  }

  color: string;
  value: number;
  id: number;
  opaqueId: UUID;
  chipSet: ChipSet;
  owner: Player;
}
