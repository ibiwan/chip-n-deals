import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module, forwardRef } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { GraphQLFormattedError } from 'graphql';

import {
  allFeatures,
  ChipSetModule,
  PlayerModule,
  TableModule,
  ChipModule,
} from '@/features';

@Module({
  imports: [
    forwardRef(() => ChipSetModule),
    forwardRef(() => PlayerModule),
    forwardRef(() => TableModule),
    forwardRef(() => ChipModule),

    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      include: allFeatures,
      path: 'graphql',
      formatError: (
        formattedError: GraphQLFormattedError,
        _error: unknown,
      ): GraphQLFormattedError => {
        console.log(`graphql error: ${JSON.stringify(formattedError)}`);
        return formattedError;
      },
    }),
    // template for custom context entries/formats
    // context: ({ req, res }) => {
    //   return { req, res };
    // },
  ],
})
export class GraphqlApiModule {}
