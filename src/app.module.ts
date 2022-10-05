import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { CompanyModule } from './modules/company/company.module';
import { EmployeeModule } from './modules/employee/employee.module';
import { UsersModule } from './modules/users/users.module';
import { SharedModule } from './shared/config.module';

@Module({
  imports: [
    DatabaseModule,
    SharedModule,
    UsersModule,
    CompanyModule,
    EmployeeModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
