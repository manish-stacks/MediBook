// src/specialities/specialities.module.ts
import { Module } from '@nestjs/common';
import { SpecialitiesController } from './specialities.controller';
import { SpecialitiesService } from './specialities.service';

@Module({
  controllers: [SpecialitiesController],
  providers: [SpecialitiesService],
  exports: [SpecialitiesService],
})
export class SpecialitiesModule {}
