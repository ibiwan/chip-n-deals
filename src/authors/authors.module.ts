import { Module } from '@nestjs/common';
import { AuthorsResolver } from './authors.resolver';
import { AuthorsService } from './authors.service';
import { PostsModule } from '@/posts/posts.module';

@Module({
  imports: [PostsModule],
  providers: [AuthorsResolver, AuthorsService],
})

export class AuthorsModule { }
