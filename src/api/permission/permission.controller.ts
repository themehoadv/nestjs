import { Uuid } from '@/common/types/common.type';
import { ApiPublic } from '@/decorators/http.decorators';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { CreatePermissionDto, UpdatePermissionDto } from './dto';
import { PermissionService } from './permission.service';

@ApiTags('permissions')
@Controller({
  path: 'permissions',
  version: '1',
})
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}
  @ApiPublic()
  @Post()
  create(@Body() createPermissionDto: CreatePermissionDto) {
    return this.permissionService.create(createPermissionDto);
  }

  @ApiPublic()
  @Get()
  findAll() {
    return this.permissionService.findAll();
  }

  @ApiPublic()
  @ApiParam({ name: 'roleId', type: 'String' })
  @Get('role/:roleId')
  findByRole(@Param('roleId') roleId: Uuid) {
    return this.permissionService.findByRole(roleId);
  }

  @ApiPublic()
  @Get('resource/:resourceId')
  @ApiParam({ name: 'resourceId', type: 'String' })
  findByResource(@Param('resourceId') resourceId: Uuid) {
    return this.permissionService.findByResource(resourceId);
  }

  @ApiPublic()
  @Get(':id')
  @ApiParam({ name: 'id', type: 'String' })
  findOne(@Param('id') id: Uuid) {
    return this.permissionService.findOne(id);
  }

  @ApiPublic()
  @Patch(':id')
  @ApiParam({ name: 'id', type: 'String' })
  update(
    @Param('id') id: Uuid,
    @Body() updatePermissionDto: UpdatePermissionDto,
  ) {
    return this.permissionService.update(id, updatePermissionDto);
  }

  @ApiPublic()
  @Delete(':id')
  @ApiParam({ name: 'id', type: 'String' })
  remove(@Param('id') id: Uuid) {
    return this.permissionService.remove(id);
  }
}
