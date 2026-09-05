import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

const SEARCH_LIMIT = 10;

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async search(query: string, excludeUserId: string) {
    const trimmed = query.trim();
    if (!trimmed) {
      return [];
    }

    return this.prisma.user.findMany({
      where: {
        username: { contains: trimmed, mode: 'insensitive' },
        id: { not: excludeUserId },
      },
      select: { id: true, username: true },
      orderBy: { username: 'asc' },
      take: SEARCH_LIMIT,
    });
  }
}
