import { Module } from '@nestjs/common';

import { ChipsGraphqlModule } from './api/graphql.module';
import { DatasourceModule } from './datasource/sqlite.datasource.module';
import { ChipModule } from './features/chip/chip.module';
import { ChipSetModule } from './features/chipSet/chipSet.module';

@Module({
  imports: [ChipModule, ChipSetModule, ChipsGraphqlModule, DatasourceModule],
})
export class AppModule {}
