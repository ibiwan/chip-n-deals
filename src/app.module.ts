import { Module } from '@nestjs/common';

import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { AuthorsModule } from '@/entities/authors/authors.module';
import { PostsModule } from '@/entities/posts/posts.module';

@Module({
  imports: [
    AuthorsModule,
    PostsModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      include: [AuthorsModule, PostsModule],
    }),
  ]
})

export class AppModule {}
