import { Module } from '@nestjs/common';
import { Post } from './models/post.model';
import { PostsService } from './posts.service';

@Module({
  providers: [Post, PostsService],
  exports: [PostsService]
})

export class PostsModule { }
