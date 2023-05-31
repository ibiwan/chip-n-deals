import { UUID } from 'crypto';

import { ChipSetCore } from './chipSet.core';

export class ChipSetDbRow implements ChipSetCore {
  id: number;
  opaqueId: UUID;
  name: string;
  ownerId: number;
}
