import { Injectable, NotFoundException } from '@nestjs/common';
import { nanoid } from 'nanoid';
import { PrismaService } from '../prisma/prisma.service';
import { CategoriesService } from '../categories/categories.service';
import { CreateSharedStateDto } from './dto/create-shared-state.dto';

const CODE_LENGTH = 8;
const MAX_ATTEMPTS = 5;

@Injectable()
export class SharedStatesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly categoriesService: CategoriesService,
  ) {}

  async create(dto: CreateSharedStateDto) {
    const category = this.categoriesService.findOne(dto.categoryId);

    // No owning user here, so the code has to be unique across the whole
    // table (unlike MoodState.code, which is only unique per user).
    for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
      const code = nanoid(CODE_LENGTH);
      const existing = await this.prisma.sharedState.findUnique({ where: { code } });
      if (existing) {
        continue;
      }

      const state = await this.prisma.sharedState.create({
        data: {
          code,
          categoryId: category.id,
          categoryName: category.selectedLabel,
        },
      });

      return {
        code: state.code,
        categoryId: state.categoryId,
        categoryName: state.categoryName,
        createdAt: state.createdAt,
      };
    }

    throw new Error('Could not generate a unique code, please try again');
  }

  async findByCode(code: string) {
    const state = await this.prisma.sharedState.findUnique({ where: { code } });
    if (!state) {
      throw new NotFoundException('Code introuvable');
    }

    return {
      categoryId: state.categoryId,
      categoryName: state.categoryName,
      createdAt: state.createdAt,
    };
  }
}
