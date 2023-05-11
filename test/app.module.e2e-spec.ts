import { Test } from '@nestjs/testing';
import { AppModule } from '@/app.module';
import { ChipSetService } from '@/features/chipSet/chipSet.service';
import { ChipService } from '@/features/chip/chip.service';
import { ChipResolver } from '@/features/chip/chip.resolver';
import { ChipSetResolver } from '@/features/chipSet/chipSet.resolver';
import { ChipController } from '@/features/chip/chip.rest.controller';
import { ChipSetController } from '@/features/chipSet/chipSet.rest.controller';

describe('AppModule', () => {
  it('should compile the module', async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    expect(module).toBeDefined();

    expect(module.get(ChipService))
    expect(module.get(ChipSetService))
    expect(module.get(ChipResolver))
    expect(module.get(ChipSetResolver))
    expect(module.get(ChipController))
    expect(module.get(ChipSetController))
  });
});
