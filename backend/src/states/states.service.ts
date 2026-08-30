import { Injectable } from '@nestjs/common';
import { nanoid } from 'nanoid';
import { PrismaService } from '../prisma/prisma.service';
import { CategoriesService } from '../categories/categories.service';
import { CreateStateDto } from './dto/create-state.dto';

const CODE_LENGTH = 8;
const MAX_ATTEMPTS = 5;

@Injectable()
export class StatesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly categoriesService: CategoriesService,
  ) {}

  private buildUrl(username: string, code: string): string {
    const baseUrl = (process.env.BASE_URL ?? 'http://localhost:5173').replace(/\/$/, '');
    return `${baseUrl}/${username}/${code}`;
  }

  async create(userId: string, username: string, dto: CreateStateDto) {
    const step = this.categoriesService.findFeeling(dto.stepId, dto.feeling);

    // The code only has to be unique for this user (the public URL is
    // {username}/{code}), so on the rare collision we just draw another one.
    for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
      const code = nanoid(CODE_LENGTH);
      const existing = await this.prisma.moodState.findUnique({
        where: { userId_code: { userId, code } },
      });
      if (existing) {
        continue;
      }

      const state = await this.prisma.moodState.create({
        data: {
          userId,
          code,
          stepId: step.id,
          stepName: step.name,
          feeling: dto.feeling,
        },
      });

      return {
        id: state.id,
        code: state.code,
        stepId: state.stepId,
        stepName: state.stepName,
        feeling: state.feeling,
        createdAt: state.createdAt,
        url: this.buildUrl(username, state.code),
      };
    }

    throw new Error('Could not generate a unique code, please try again');
  }

  async findAllForUser(userId: string, username: string) {
    const states = await this.prisma.moodState.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    return states.map((state) => ({
      id: state.id,
      code: state.code,
      stepId: state.stepId,
      stepName: state.stepName,
      feeling: state.feeling,
      createdAt: state.createdAt,
      url: this.buildUrl(username, state.code),
    }));
  }
}
