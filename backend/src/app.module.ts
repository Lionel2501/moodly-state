import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { CategoriesModule } from './categories/categories.module';
import { StatesModule } from './states/states.module';
import { PublicModule } from './public/public.module';
import { UsersModule } from './users/users.module';
import { SharedStatesModule } from './shared-states/shared-states.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    CategoriesModule,
    StatesModule,
    PublicModule,
    UsersModule,
    SharedStatesModule,
  ],
})
export class AppModule {}
