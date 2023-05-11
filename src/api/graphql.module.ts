import { Module } from '@nestjs/common';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { GraphQLModule } from '@nestjs/graphql';

import { ChipModule } from '@/features/chip/chip.module';
import { ChipSetModule } from '@/features/chipSet/chipSet.module';

const GqlFeatureModules = [ChipModule, ChipSetModule];

@Module({
  imports: [
    ...GqlFeatureModules,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      include: [...GqlFeatureModules],
      path: 'graphql',
    }),
  ],
})
export class ChipsGraphqlModule {}
