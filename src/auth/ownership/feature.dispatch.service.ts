import { Inject, Injectable, Logger, forwardRef } from '@nestjs/common';

import { ChipSetService } from '@/features/chipSet';
import { PlayerService } from '@/features/player';
import { ChipService } from '@/features/chip';

@Injectable()
export class FeatureDispatchService {
  constructor(
    @Inject(forwardRef(() => ChipService)) private chipService,
    @Inject(forwardRef(() => ChipSetService)) private chipSetService,
    @Inject(forwardRef(() => PlayerService)) private playerService,
  ) {}

  private readonly logger = new Logger(this.constructor.name);

  async dispatchFeatureService(
    serviceType: any,
    method: string,
    params: any[],
  ): Promise<any> {
    this.logger.verbose(
      `dispatchFeatureService, ${serviceType.name}.${method}`,
    );

    if (serviceType === ChipSetService) {
      return this.chipSetService[method](...params);
    }
    if (serviceType === PlayerService) {
      return this.playerService[method](...params);
    }
    if (serviceType === ChipService) {
      return this.chipService[method](...params);
    }
    throw Error("DISPATCH DOESN'T KNOW WHAT TO DO");
  }
}
