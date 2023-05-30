import { UUID } from 'crypto';

import { DomainObject, OwnableObject } from '@/util/root.types';

import { ChipSet } from '@/features/chipSet';
import { Player } from '@/features/player';

import { ChipCore } from './chip.core';

export class Chip implements ChipCore, DomainObject, OwnableObject<Chip> {
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
