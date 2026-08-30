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

    return {
      username: user.username,
      stepId: state.stepId,
      stepName: state.stepName,
      feeling: state.feeling,
      createdAt: state.createdAt,
    };
  }
}
