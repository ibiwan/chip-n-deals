import { UUID } from 'crypto';

import { DomainObject } from '@/types';

import { PlayerCore } from './player.core';

export class Player implements PlayerCore, DomainObject {
  constructor(
    username: string,
    passhash: string,
    id: number = null,
    opaqueId: UUID = null,
    isAdmin = false,
  ) {
    this.username = username;
    this.passhash = passhash;
    this.id = id;
    this.opaqueId = opaqueId;
    this.isAdmin = isAdmin;
  }
  username: string;
  passhash: string;
  id: number;
  opaqueId: UUID;
  isAdmin: boolean;
}
