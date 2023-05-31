import { Test } from '@nestjs/testing';

import { AppModule } from '@/app.module';
import { ChipSetService } from '@/features/chipSet/services/chipSet.service';
import { ChipService } from '@/features/chip/services/chip.service';
import { ChipResolver } from '@/features/chip/chip.resolver';
import { ChipSetResolver } from '@/features/chipSet/resolvers/chipSet.resolver.query';

describe('AppModule', () => {
  it('should compile the module', async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    expect(module).toBeDefined();

    expect(module.get(ChipService));
    expect(module.get(ChipSetService));
    expect(module.get(ChipResolver));
    expect(module.get(ChipSetResolver));
  });
});
