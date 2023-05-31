import { AuthorizationService } from '@/auth/authorization/authorization.service';
import { getTestRootModule } from '@test/helpers/testing.module';

describe('AuthorizationService', () => {
  let service: AuthorizationService;

  beforeEach(async () => {
    const module = await getTestRootModule();

    service = module.get<AuthorizationService>(AuthorizationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
