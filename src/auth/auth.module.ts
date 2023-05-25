import { Module } from '@nestjs/common';

import { AuthorizationModule } from './authorization/authz.module';
import { AuthenticationModule } from './authentication/authn.module';
import { OwnershipModule } from './ownership/ownership.module';

@Module({
  imports: [AuthorizationModule, AuthenticationModule, OwnershipModule],
  exports: [AuthorizationModule, AuthenticationModule, OwnershipModule],
})
export class AuthModule {}
