import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../user/entities/user.entity';
import { UserModule } from '../user/user.module';
import { BlogController } from './blog.controller';
import { BlogService } from './blog.service';
import { BlogEntity } from './entities/blog.entity';

@Module({
  imports: [UserModule, TypeOrmModule.forFeature([BlogEntity, UserEntity])],
  controllers: [BlogController],
  providers: [BlogService],
})
export class BlogModule {}
