import { ChipSetMutationResolver } from './chipSet.resolver.mutation';
import { ChipSetFieldResolver } from './chipSet.resolver.field';
import { ChipSetQueryResolver } from './chipSet.resolver.query';

export * from './chipSet.resolver.mutation';
export * from './chipSet.resolver.field';
export * from './chipSet.resolver.query';

export const allResolvers = [
  ChipSetFieldResolver,
  ChipSetQueryResolver,
  ChipSetMutationResolver,
];
