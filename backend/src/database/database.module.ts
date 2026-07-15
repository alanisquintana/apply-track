import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Application } from '../applications/application.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'postgres',
        url: process.env.DATABASE_URL ?? 'postgresql://applytrack:applytrack@localhost:5432/applytrack',
        entities: [Application],
        synchronize: true,
      }),
    }),
  ],
})
export class DatabaseModule {}
