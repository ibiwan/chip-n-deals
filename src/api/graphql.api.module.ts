import { IncomingMessage, ServerResponse } from 'http';

import { Module, forwardRef } from '@nestjs/common';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { GraphQLModule } from '@nestjs/graphql';

import { FeatureModule } from '@/features/features.module';
import { GraphQLFormattedError } from 'graphql';

export interface GqlContextValue {
  req: IncomingMessage;
  res: ServerResponse;
}

@Module({
  imports: [
    forwardRef(() => FeatureModule),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      include: [FeatureModule],
      path: 'graphql',
      // context: ({ req, res }) => {
      //   return { req, res };
      // },
      formatError: (
        formattedError: GraphQLFormattedError,
        _error: unknown,
      ): GraphQLFormattedError => {
        console.log(`graphql error: ${JSON.stringify(formattedError)}`);
        return formattedError;
      },
    }),
  ],
})
export class GraphqlApiModule {}
