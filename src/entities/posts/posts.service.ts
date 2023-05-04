import { Injectable } from '@nestjs/common';
import { Post } from './models/post.model';

@Injectable()
export class PostsService {
  findAll({ authorId }) {
    const p = new Post();
    p.id = 1;
    p.title = 'I win';
    p.votes = 27;
    console.log({ authorId, p });
    return [p];
  }
}
