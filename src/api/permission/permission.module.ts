import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleEntity } from '../role/entities/role.entity';
import { PermissionEntity } from './entities/permission.entity';
import { ResourceEntity } from './entities/resource.entity';
import { PermissionController } from './permission.controller';
import { PermissionService } from './permission.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([PermissionEntity, RoleEntity, ResourceEntity]),
  ],
  controllers: [PermissionController],
  providers: [PermissionService],
  exports: [PermissionService],
})
export class PermissionModule {}
