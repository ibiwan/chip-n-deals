import { Module } from '@nestjs/common';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { GraphQLModule } from '@nestjs/graphql';

import { ChipModule } from '@/features/chip/chip.module';
import { ChipSetModule } from '@/features/chipSet/chipSet.module';
import { IncomingMessage, ServerResponse } from 'http';

export interface GqlContextValue {
  req: IncomingMessage;
  res: ServerResponse;
}
const GqlFeatureModules = [ChipModule, ChipSetModule];

@Module({
  imports: [
    ...GqlFeatureModules,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      include: [...GqlFeatureModules],
      path: 'graphql',
      // context: ({ req, res }) => {
      //   return { req, res };
      // },
    }),
  ],
})
export class ChipsGraphqlModule {}
