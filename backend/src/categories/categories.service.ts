import { Injectable, NotFoundException } from '@nestjs/common';
import { STEPS, CategoryStep } from './categories.data';

@Injectable()
export class CategoriesService {
  findAll(): CategoryStep[] {
    return STEPS;
  }

  findOne(stepId: number): CategoryStep {
    const step = STEPS.find((s) => s.id === stepId);
    if (!step) {
      throw new NotFoundException('Category not found');
    }
    return step;
  }

  findFeeling(stepId: number, feelingKey: string): CategoryStep {
    const step = this.findOne(stepId);
    if (!step.emotions.some((emotion) => emotion.key === feelingKey)) {
      throw new NotFoundException('Sub-category not found for this category');
    }
    return step;
  }
}
