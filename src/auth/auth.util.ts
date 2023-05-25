import { Request } from 'express';
import { UUID } from 'crypto';

import { ExecutionContext, SetMetadata } from '@nestjs/common';
import { GqlContextType, GqlExecutionContext } from '@nestjs/graphql';

export const IS_PUBLIC_KEY = 'IS_PUBLIC_KEY';
export const OWNERSHIP_GETTER = 'OWNERSHIP_GETTER';

export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
export type ID = number | UUID;

export const extractRequestFromContext = (
  context: ExecutionContext,
): Request => {
  if ((context.getType() as GqlContextType) == 'graphql') {
    return GqlExecutionContext.create(context).getContext().req;
  }
  return context.switchToHttp().getRequest();
};

export const extractTokenFromRequestHeader = (
  request: Request,
): string | undefined => {
  const [type, token] = request.headers.authorization?.split(' ') ?? [];
  return type === 'Bearer' ? token : undefined;
};
