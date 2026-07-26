import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum ApplicationStatus {
  Applied = 'applied',
  Interviewing = 'interviewing',
  Offer = 'offer',
  Rejected = 'rejected',
}

export enum WorkModel {
  Remote = 'remote',
  Hybrid = 'hybrid',
  OnSite = 'on-site',
}

@Entity('applications')
export class Application {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  company: string;

  @Column({ type: 'varchar', length: 255 })
  role: string;

  @Column({ type: 'varchar', default: ApplicationStatus.Applied })
  status: ApplicationStatus;

  @Column({ type: 'date' })
  appliedAt: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ type: 'date', nullable: true })
  interviewDate: string | null;

  @Column({ type: 'varchar', length: 5, nullable: true })
  interviewTime: string | null;

  @Column({ type: 'varchar', length: 500, nullable: true })
  link: string | null;

  @Column({ type: 'varchar', length: 500, nullable: true })
  logoUrl: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  appliedWhere: string | null;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  salaryMin: number | null;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  salaryMax: number | null;

  @Column({ type: 'varchar', length: 500, nullable: true })
  recruiterLink: string | null;

  @Column({ type: 'varchar', length: 20, nullable: true })
  workModel: WorkModel | null;

  @Column({ type: 'varchar', length: 500, nullable: true })
  interviewLink: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
