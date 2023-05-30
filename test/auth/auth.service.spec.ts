import { AuthorizationService } from '@/auth/authentication/authn.service';
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
