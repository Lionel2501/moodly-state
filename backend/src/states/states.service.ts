import { Injectable, NotFoundException } from '@nestjs/common';
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

    let aboutUser: { id: string; username: string } | null = null;
    if (dto.aboutUserId) {
      aboutUser = await this.prisma.user.findUnique({
        where: { id: dto.aboutUserId },
        select: { id: true, username: true },
      });
      if (!aboutUser) {
        throw new NotFoundException('Selected user not found');
      }
    }

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

      // A creator can only have one state about a given person at a time —
      // associating a new one to someone who already has one replaces it.
      const state = aboutUser
        ? await this.prisma.moodState.upsert({
            where: { userId_aboutUserId: { userId, aboutUserId: aboutUser.id } },
            update: {
              code,
              stepId: step.id,
              stepName: step.name,
              feeling: dto.feeling,
              createdAt: new Date(),
            },
            create: {
              userId,
              code,
              stepId: step.id,
              stepName: step.name,
              feeling: dto.feeling,
              aboutUserId: aboutUser.id,
            },
          })
        : await this.prisma.moodState.create({
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
        aboutUser,
      };
    }

    throw new Error('Could not generate a unique code, please try again');
  }

  async findAllForUser(userId: string, username: string) {
    const states = await this.prisma.moodState.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: { aboutUser: { select: { id: true, username: true } } },
    });

    return states.map((state) => ({
      id: state.id,
      code: state.code,
      stepId: state.stepId,
      stepName: state.stepName,
      feeling: state.feeling,
      createdAt: state.createdAt,
      url: this.buildUrl(username, state.code),
      aboutUser: state.aboutUser,
    }));
  }
}
