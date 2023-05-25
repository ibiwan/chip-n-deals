import { PlayerService } from '@/features/player/player.service';
import { getTestRootModule } from '@test/helpers/testing.module';

describe('PlayerService', () => {
  let service: PlayerService;

  beforeEach(async () => {
    const module = await getTestRootModule();

    service = module.get<PlayerService>(PlayerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
