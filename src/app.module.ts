import generateModulesSet from '@/utils/modules-set';
import { Module } from '@nestjs/common';

@Module({
  imports: generateModulesSet(),
})
export class AppModule {}
