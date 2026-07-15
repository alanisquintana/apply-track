import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { ApplicationsModule } from './applications/applications.module';

@Module({
  imports: [DatabaseModule, ApplicationsModule],
})
export class AppModule {}
