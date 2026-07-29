import { resolve, dirname } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Application } from '../applications/application.entity';
import { homedir } from 'os';

function getDbPath(): string {
  const env = process.env.DB_PATH;
  if (env) return env;

  if (process.platform === 'win32' && process.env.APPDATA) {
    return resolve(process.env.APPDATA, 'ApplyTrack', 'applytrack.db');
  }

  return resolve(homedir(), '.local', 'share', 'applytrack', 'applytrack.db');
}

function ensureDir(filePath: string) {
  const dir = dirname(filePath);
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
}

const dbPath = getDbPath();
ensureDir(dbPath);

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'better-sqlite3',
        database: dbPath,
        entities: [Application],
        synchronize: true,
      }),
    }),
  ],
})
export class DatabaseModule {}
