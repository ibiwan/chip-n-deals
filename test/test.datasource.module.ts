import { testDbConfig } from "@/datasource/sqlite.datasource.module";
import { ChipModule } from "@/features/chip/chip.module";
import { ChipSetModule } from "@/features/chipSet/chipSet.module";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
  imports: [
    TypeOrmModule.forRoot(testDbConfig),
    ChipModule, ChipSetModule,
  ],
  exports: [],
})
export class TestDatasourceModule { }
