import { resolve } from 'path';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Application } from '../applications/application.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'better-sqlite3',
        database: resolve(__dirname, '..', '..', 'data', 'applytrack.db'),
        entities: [Application],
        synchronize: true,
      }),
    }),
  ],
})
export class DatabaseModule {}
