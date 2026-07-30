import { resolve, dirname } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Application } from '../applications/application.entity';
import { homedir } from 'os';
import { createRequire } from 'node:module';

function getDbPath(): string {
  const env = process.env.DB_PATH;
  if (env) return env;

  if (process.platform === 'win32' && process.env.APPDATA) {
    return resolve(process.env.APPDATA, 'ApplyTrack', 'applytrack.db');
  }

  return resolve(homedir(), '.local', 'share', 'applytrack', 'applytrack.db');
}

function resolveNativeModule(): any | undefined {
  const binaryDir = dirname(process.execPath);
  const candidates: string[] = [];
  const nativePath = process.env.NATIVE_PATH;
  if (nativePath) {
    candidates.push(resolve(nativePath, 'better-sqlite3'));
  }
  candidates.push(
    resolve(binaryDir, 'node_modules', 'better-sqlite3'),
    resolve(process.cwd(), 'node_modules', 'better-sqlite3'),
  );
  for (const pkgDir of candidates) {
    if (existsSync(resolve(pkgDir, 'lib', 'database.js'))) {
      const req = createRequire(resolve(binaryDir, 'noop.js'));
      return req(pkgDir);
    }
  }
}

function ensureDir(filePath: string) {
  const dir = dirname(filePath);
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
}

const dbPath = getDbPath();
ensureDir(dbPath);
const nativeDriver = resolveNativeModule();

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'better-sqlite3',
        database: dbPath,
        driver: nativeDriver,
        entities: [Application],
        synchronize: true,
      }),
    }),
  ],
})
export class DatabaseModule {}
