import { Injectable } from "@nestjs/common";
import { Author } from "./models/author.model";

@Injectable()
export class AuthorsService {
    findOneById(id: number) {
        const a = new Author()
        a.id = 1
        a.firstName = 'David';
        a.lastName = 'Asimov'
        a.posts = []
        console.log({ id, a })
        return a
    }
}
