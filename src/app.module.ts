import { Module } from '@nestjs/common';

import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { AuthorsModule } from '@/authors/authors.module';
import { PostsModule } from '@/posts/posts.module';
// import { join } from 'path';

@Module({
  imports: [
    AuthorsModule,
    PostsModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      // autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      autoSchemaFile: true,
      include: [AuthorsModule, PostsModule]
    }),
  ],
})

export class AppModule { }

