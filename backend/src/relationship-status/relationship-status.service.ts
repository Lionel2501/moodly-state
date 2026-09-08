import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RELATIONSHIP_STATUSES } from './relationship-status.data';

@Injectable()
export class RelationshipStatusService {
  constructor(private readonly prisma: PrismaService) {}

  findOptions() {
    return RELATIONSHIP_STATUSES;
  }

  async set(userId: string, aboutUserId: string, statusId: number) {
    const status = RELATIONSHIP_STATUSES.find((s) => s.id === statusId);
    if (!status) {
      throw new NotFoundException('Unknown status');
    }

    const aboutUser = await this.prisma.user.findFirst({
      where: { id: aboutUserId, username: { not: null } },
      select: { id: true },
    });
    if (!aboutUser) {
      throw new NotFoundException('Selected user not found');
    }

    const record = await this.prisma.relationshipStatus.upsert({
      where: { userId_aboutUserId: { userId, aboutUserId } },
      update: { statusId },
      create: { userId, aboutUserId, statusId },
    });

    return { aboutUserId, statusId: record.statusId, updatedAt: record.updatedAt };
  }

  // Everything the current user needs to render statuses across their whole
  // contacts list in one call: what they set for each contact ("mine"), and
  // what each contact set about them in return ("theirs").
  async findForContacts(userId: string) {
    const [mine, theirs] = await Promise.all([
      this.prisma.relationshipStatus.findMany({ where: { userId } }),
      this.prisma.relationshipStatus.findMany({ where: { aboutUserId: userId } }),
    ]);

    return {
      mine: mine.map((r) => ({ aboutUserId: r.aboutUserId, statusId: r.statusId, updatedAt: r.updatedAt })),
      theirs: theirs.map((r) => ({ userId: r.userId, statusId: r.statusId, updatedAt: r.updatedAt })),
    };
  }
}
