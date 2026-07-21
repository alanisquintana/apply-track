import { config } from 'dotenv';
import { resolve } from 'path';
config({ path: resolve(__dirname, '../../.env') });

import { DataSource } from 'typeorm';
import { Application, ApplicationStatus } from './applications/application.entity';

const AppDataSource = new DataSource({
  type: 'better-sqlite3',
  database: resolve(__dirname, '..', 'data', 'applytrack.db'),
  entities: [Application],
  synchronize: true,
});

async function seed() {
  await AppDataSource.initialize();
  const repo = AppDataSource.getRepository(Application);

  const samples = [
    { company: 'Google', role: 'Software Engineer', status: ApplicationStatus.Interviewing, appliedAt: '2026-06-15', appliedWhere: 'LinkedIn' },
    { company: 'Meta', role: 'Frontend Engineer', status: ApplicationStatus.Applied, appliedAt: '2026-07-01', appliedWhere: 'Company website' },
    { company: 'Stripe', role: 'Full Stack Developer', status: ApplicationStatus.Rejected, appliedAt: '2026-05-20', link: 'https://stripe.com/jobs' },
    { company: 'Airbnb', role: 'Senior Frontend', status: ApplicationStatus.Offer, appliedAt: '2026-04-10', interviewDate: '2026-05-01', appliedWhere: 'LinkedIn' },
    { company: 'Notion', role: 'Product Engineer', status: ApplicationStatus.Applied, appliedAt: '2026-07-05', description: 'Fully remote position. Tech stack: TypeScript, React, Node.js.' },
  ];

  for (const data of samples) {
    const app = repo.create(data);
    await repo.save(app);
  }

  await AppDataSource.destroy();
  console.log('Seed data inserted successfully.');
}

seed().catch(e => {
  console.error('Seed failed:', e);
  process.exit(1);
});
