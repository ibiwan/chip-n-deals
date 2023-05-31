import { UUID } from 'crypto';
import * as _ from 'lodash';

import { DomainObject, OwnableObject, from } from '@/types';

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

  static from = from(() => Chip.prototype);

  color: string;
  value: number;
  id: number;
  opaqueId: UUID;
  chipSet: ChipSet;
  owner: Player;
}
