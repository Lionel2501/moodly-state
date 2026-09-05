import { Controller, Get } from '@nestjs/common';
import { CategoriesService } from './categories.service';

// Public: category/emotion data is static, non-sensitive config, and is
// also needed by the anonymous "share an emotion" flow.
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  findAll() {
    return { steps: this.categoriesService.findAll() };
  }
}
