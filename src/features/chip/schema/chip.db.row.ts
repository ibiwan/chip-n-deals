import { UUID } from 'crypto';

import { ChipCore } from './chip.core';

export interface ChipDbRow extends ChipCore {
  id: number;
  opaqueId: UUID;
  color: string;
  value: number;
  chipSetId: number;
  ownerId: number;
}
