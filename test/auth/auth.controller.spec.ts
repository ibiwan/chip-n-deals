import { AuthController } from '@/auth/authentication/authn.controller';
import { getTestRootModule } from '@test/helpers/testing.module';

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module = await getTestRootModule();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
