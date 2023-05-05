import { Module } from '@nestjs/common';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { GraphQLModule } from '@nestjs/graphql';

import { ChipModule } from '@/features/chip/chip.module';
import { ChipSetModule } from '@/features/chipSet/chipSet.module';

@Module({
  imports: [
    ChipModule,
    ChipSetModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      include: [
        ChipModule,
        ChipSetModule,
      ],
      path: 'graphql',
    }),
  ],
})
export class ChipsGraphqlModule {}
