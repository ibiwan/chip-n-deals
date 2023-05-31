import { UUID } from 'crypto';

import { ChipCore } from './chip.core';

export class ChipDbRow implements ChipCore {
  id: number;
  opaqueId: UUID;
  color: string;
  value: number;
  chipSetId: number;
  ownerId: number;
}
