import { ChipMutationResolver } from './chip.resolver.mutation';
import { ChipFieldResolver } from './chip.resolver.field';
import { ChipQueryResolver } from './chip.resolver.query';

export * from './chip.resolver.mutation';
export * from './chip.resolver.field';
export * from './chip.resolver.query';

export const allResolvers = [
  ChipFieldResolver,
  ChipQueryResolver,
  ChipMutationResolver,
];
