import { UUID } from 'crypto';

import { ChipSetCore } from '@/features/chipSet';
import { PlayerCore } from '@/features/player';
import { CoreObject } from '@/types';

import { ChipCore } from './chip.core';

export class ChipMeta implements CoreObject {
  constructor(source: ChipCore | any) {
    Object.assign(this, source);

    if (this.chipSet && !this.chipSetId) {
      this.chipSetId = this.chipSet?.id;
    }

    if (this.chipSet && !this.chipSetOpaqueId) {
      this.chipSetOpaqueId = this.chipSet?.opaqueId;
    }

    if (this.owner && !this.ownerId) {
      this.ownerId = this.owner?.id;
    }
  }

  id?: number = null;
  opaqueId?: UUID = null;

  color: string = null;
  value: number = null;

  chipSet?: ChipSetCore | any = null;
  chipSetId?: number = null;
  chipSetOpaqueId?: UUID = null;

  owner?: PlayerCore | any = null;
  ownerId?: number = null;
}
