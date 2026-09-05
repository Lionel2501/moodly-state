import { Module } from '@nestjs/common';
import { SharedStatesController } from './shared-states.controller';
import { SharedStatesService } from './shared-states.service';
import { CategoriesModule } from '../categories/categories.module';

@Module({
  imports: [CategoriesModule],
  controllers: [SharedStatesController],
  providers: [SharedStatesService],
})
export class SharedStatesModule {}
