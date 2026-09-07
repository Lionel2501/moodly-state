import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Controller('public')
export class PublicController {
  constructor(private readonly prisma: PrismaService) {}

  @Get(':username/:code')
  async findState(@Param('username') username: string, @Param('code') code: string) {
    const user = await this.prisma.user.findUnique({ where: { username } });
    if (!user) {
      throw new NotFoundException('State not found');
    }

    const state = await this.prisma.moodState.findUnique({
      where: { userId_code: { userId: user.id, code } },
    });
    if (!state) {
      throw new NotFoundException('State not found');
    }

    if (!state.checked) {
      await this.prisma.moodState.update({
        where: { id: state.id },
        data: { checked: true },
      });
    }

    return {
      username: user.username,
      categoryId: state.categoryId,
      categoryName: state.categoryName,
      createdAt: state.createdAt,
    };
  }
}
