import { AuthService } from '@/auth/authentication/authn.service';
import { getTestRootModule } from '@test/helpers/testing.module';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module = await getTestRootModule();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
