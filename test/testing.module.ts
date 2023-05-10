import { ChipsGraphqlModule } from "@/api/graphql.module";
import { ControllerModule } from "@/api/rest.controller.module";
import { ChipModule } from "@/features/chip/chip.module";
import { ChipSetModule } from "@/features/chipSet/chipSet.module";
import { Test, TestingModule } from "@nestjs/testing";
import { TestDatasourceModule } from "./test.datasource.module";

export const getTestRootModule = async (): Promise<TestingModule> => {
  const testModuleBuilder = await Test.createTestingModule({
    imports: [
      ChipModule,
      ChipSetModule,
      ChipsGraphqlModule,
      ControllerModule,
      TestDatasourceModule,
    ],
    providers: [],
  })

  return await testModuleBuilder.compile();
}
