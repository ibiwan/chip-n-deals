import { UUID } from 'crypto';

import { CoreObject } from '@/types';

import { PlayerCore } from '@/features/player';
import { ChipCore } from '@/features/chip';

import { ChipSetCore } from './chipSet.core';

export class ChipSetMeta implements CoreObject {
  constructor(source: ChipSetCore | any) {
    Object.assign(this, source);

    if (this.owner && !this.ownerId) {
      this.ownerId = this.owner?.id;
    }
  }

  id?: number;
  opaqueId?: UUID;
  name?: string;
  chips?: ChipCore[] | any[];
  owner?: PlayerCore | any;
  ownerId?: number;
}
