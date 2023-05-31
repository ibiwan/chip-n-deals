import { AuthenticationController } from '@/auth/authentication/authentication.controller';
import { getTestRootModule } from '@test/helpers/testing.module';

describe('AuthController', () => {
  let controller: AuthenticationController;

  beforeEach(async () => {
    const module = await getTestRootModule();

    controller = module.get<AuthenticationController>(AuthenticationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
