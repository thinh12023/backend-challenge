import { Global, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SharedModule } from "src/shared/config.module";
import { ConfigService } from "src/shared/config.service";

@Global()
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [SharedModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',

        host: configService.db.host,
        port: configService.db.port,
        username: configService.db.user,
        password: configService.db.pass,
        database: configService.db.name,

        entities: [__dirname + '/entities/*.entity.{ts,js}'],
        logging: false,
        synchronize: true,
        migrationsRun: true,
        migrationsTransactionMode: 'each',
        migrations: [__dirname + '/migrations/*.{ts,js}'],
      }),
    }),
  ],
})
export class DatabaseModule {}