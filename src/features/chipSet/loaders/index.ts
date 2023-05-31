import { ChipsByChipSetOpaqueIdFactory } from '@/features/chip/loaders';
import { ChipSetByIdFactory } from './chipSet.dataLoader.id';

export * from './chipSet.dataLoader.id';
export * from './chipSet.dataLoader.opaqueId';

export const allLoaders = [ChipSetByIdFactory, ChipsByChipSetOpaqueIdFactory];
