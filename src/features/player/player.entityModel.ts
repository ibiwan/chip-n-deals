import { UUID, randomUUID } from 'crypto';
import { Column, Entity, PrimaryGeneratedColumn, Repository } from 'typeorm';

import { Field, InputType, ObjectType } from '@nestjs/graphql';

// combine graphql object type, domain model,
// and database entity def in one class using attributes
@Entity('player')
@ObjectType('Player')
export class PlayerEntityModel {
  constructor(username: string, passhash: string = null) {
    this.username = username;
    this.passhash = passhash;
    this.opaqueId = randomUUID();
  }

  @PrimaryGeneratedColumn()
  // exclude from graphql type
  id?: number;

  @Column()
  @Field()
  opaqueId?: UUID;

  @Column()
  @Field()
  username: string;

  @Column()
  @Field()
  passhash: string;

  @Column()
  @Field()
  isAdmin: boolean = false;
}

@InputType('CreatePlayerInput')
export class CreatePlayerDto {
  @Field()
  username: string;

  @Field()
  password: string;
}

export type PlayerRepository = Repository<PlayerEntityModel>;
