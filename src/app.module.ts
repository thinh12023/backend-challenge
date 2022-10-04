import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './modules/users/users.module';
import { SharedModule } from './shared/config.module';

@Module({
  imports: [
    DatabaseModule,
    SharedModule,
    UsersModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
