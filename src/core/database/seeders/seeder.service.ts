import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { ConfigService } from '@nestjs/config';
import bcrypt from 'bcrypt';

@Injectable()
export class SeederService implements OnModuleInit {
  username: string;
  password: string;
  public logger: Logger = new Logger(SeederService.name);

  constructor(
    private db: PrismaService,
    private configService: ConfigService,
  ) {
    this.username = this.configService.get('SUPER_ADMIN_USERNAME') as string;
    this.password = this.configService.get('SUPER_ADMIN_PASSWORD') as string;
  }

  onModuleInit() {
    this.initSeeder();
  }

  async initSeeder() {
    const hashedPassword = await bcrypt.hash(this.password, 12);

    await this.db.prisma.user.upsert({
      where: { username: this.username },
      update: {}, 
      create: {
        username: this.username,
        password: hashedPassword,
      },
    });

    this.logger.log('Admin ensured in database');
  }
}
