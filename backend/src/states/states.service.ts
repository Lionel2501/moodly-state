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
    const baseUrl = (process.env.BASE_URL ?? 'https://kanjoo.vercel.app').replace(/\/$/, '');
    return `${baseUrl}/${username}/${code}`;
  }

  async create(userId: string, username: string, dto: CreateStateDto) {
    const category = this.categoriesService.findOne(dto.categoryId);

    let aboutUser: { id: string; username: string } | null = null;
    if (dto.aboutUserId) {
      const found = await this.prisma.user.findFirst({
        where: { id: dto.aboutUserId, username: { not: null } },
        select: { id: true, username: true },
      });
      if (!found) {
        throw new NotFoundException('Selected user not found');
      }
      aboutUser = found as { id: string; username: string };
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
              categoryId: category.id,
              categoryName: category.name,
              createdAt: new Date(),
            },
            create: {
              userId,
              code,
              categoryId: category.id,
              categoryName: category.name,
              aboutUserId: aboutUser.id,
            },
          })
        : await this.prisma.moodState.create({
            data: {
              userId,
              code,
              categoryId: category.id,
              categoryName: category.name,
            },
          });

      return {
        id: state.id,
        code: state.code,
        categoryId: state.categoryId,
        categoryName: state.categoryName,
        createdAt: state.createdAt,
        url: this.buildUrl(username, state.code),
        aboutUser,
      };
    }

    throw new Error('Could not generate a unique code, please try again');
  }

  // A "contact" is another user linked to the current one through a kanjo,
  // in either direction: one I created about them, or one they created about me.
  // A sent kanjo with no aboutUserId (created via "skip association") is still
  // listed, with a null user — the frontend shows it as an unknown contact.
  async findContacts(userId: string, username: string) {
    const [sent, received] = await Promise.all([
      this.prisma.moodState.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        include: { aboutUser: { select: { id: true, username: true } } },
      }),
      this.prisma.moodState.findMany({
        where: { aboutUserId: userId },
        orderBy: { createdAt: 'desc' },
        include: { user: { select: { id: true, username: true } } },
      }),
    ]);

    const sentContacts = sent.map((state) => {
      const contactUser = state.aboutUser as { id: string; username: string } | null;
      return {
        id: state.id,
        user: contactUser,
        categoryId: state.categoryId,
        categoryName: state.categoryName,
        direction: 'sent' as const,
        createdAt: state.createdAt,
        url: this.buildUrl(username, state.code),
      };
    });

    const receivedContacts = received.map((state) => {
      const contactUser = state.user as { id: string; username: string };
      return {
        id: state.id,
        user: contactUser,
        categoryId: state.categoryId,
        categoryName: state.categoryName,
        direction: 'received' as const,
        createdAt: state.createdAt,
        url: this.buildUrl(contactUser.username, state.code),
      };
    });

    return [...sentContacts, ...receivedContacts].sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
    );
  }

  // Only the creator can delete a kanjo — the userId filter also acts as the
  // ownership check, so someone else's id here just yields a 404.
  async remove(userId: string, id: string) {
    const { count } = await this.prisma.moodState.deleteMany({ where: { id, userId } });
    if (count === 0) {
      throw new NotFoundException('Kanjo not found');
    }
    return { success: true };
  }
}
