import { Injectable, NotFoundException } from '@nestjs/common';
import { CATEGORIES, Category } from './categories.data';

@Injectable()
export class CategoriesService {
  findAll(): Category[] {
    return CATEGORIES;
  }

  findOne(categoryId: number): Category {
    const category = CATEGORIES.find((c) => c.id === categoryId);
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    return category;
  }
}
