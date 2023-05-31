import { ChipsByChipSetIdFactory } from './chip.dataLoader.chipSetId';
import { ChipsByChipIdFactory } from './chip.dataLoader.id';
import { ChipsByChipSetOpaqueIdFactory } from './chip.dataLoader.opaqueId';

export * from './chip.dataLoader.chipSetId';
export * from './chip.dataLoader.id';
export * from './chip.dataLoader.opaqueId';

export const allLoaders = [
  ChipsByChipSetOpaqueIdFactory,
  ChipsByChipSetIdFactory,
  ChipsByChipIdFactory,
];
