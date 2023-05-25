import { Inject, Injectable, forwardRef } from '@nestjs/common';

import { PlayerService } from '@/features/player/player.service';
import { ChipService } from '@/features/chip/chip.service';
import { ChipSetService } from '@/features/chipSet/chipSet.service';

@Injectable()
export class FeatureDispatchService {
  constructor(
    @Inject(forwardRef(/* istanbul ignore next */ () => PlayerService))
    private playerService,
    @Inject(forwardRef(/* istanbul ignore next */ () => ChipService))
    private chipService,
    @Inject(forwardRef(/* istanbul ignore next */ () => ChipSetService))
    private chipSetService,
  ) {}

  async dispatchFeatureService(
    serviceType: any,
    method: string,
    params: any[],
  ): Promise<any> {
    if (serviceType === ChipService) {
      return this.chipService[method](...params);
    }
    if (serviceType === ChipSetService) {
      return this.chipSetService[method](...params);
    }
    throw Error("DISPATCH DOESN'T KNOW WHAT TO DO");
  }
}
