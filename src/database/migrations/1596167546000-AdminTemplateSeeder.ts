
import { MigrationInterface, QueryRunner } from 'typeorm';

export class AdminTemplateSeeder1596167546000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.connection.getRepository('users').save([
        {
            fullName: 'super_admin',
            username: 'super_admin',
            password: 'super_admin',
            email: 'super_admin@mail.com',
            gender: "OTHER",
            status: "ACTIVE",
            role: "SUPER_ADMIN"
        },
        {
          fullName: 'admin',
          username: 'admin',
          password: 'admin',
          email: 'admin@mail.com',
          gender: "OTHER",
          status: "ACTIVE",
          role: "ADMIN"
      },
    
  ]);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    // TODO: reverse transaction
  }
}
