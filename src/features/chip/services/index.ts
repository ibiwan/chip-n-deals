import { ChipRepository } from './chip.repository';
import { ChipService } from './chip.service';
import { ChipMapper } from './chip.mapper';

export * from './chip.repository';
export * from './chip.service';
export * from './chip.mapper';

export const allServices = [ChipMapper, ChipRepository, ChipService];
