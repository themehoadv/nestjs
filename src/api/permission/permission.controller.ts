import { OffsetListDto } from '@/common/dto/offset-pagination/offset-list.dto';
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
  Query,
} from '@nestjs/common';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import {
  CreatePermissionDto,
  ListPermissionReqDto,
  PermissionResDto,
  UpdatePermissionDto,
} from './dto';
import {} from './dto/permission.res.dto';
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
  @Get('/all')
  findAll() {
    return this.permissionService.findAll();
  }

  @ApiPublic()
  @Get('/resources')
  findAllResource() {
    return this.permissionService.findAllResource();
  }

  @Get()
  @ApiPublic({
    type: OffsetListDto<PermissionResDto>,
    summary: 'List permissions',
  })
  async findPermissionList(
    @Query() reqDto: ListPermissionReqDto,
  ): Promise<OffsetListDto<PermissionResDto>> {
    return await this.permissionService.findList(reqDto);
  }

  @ApiPublic()
  @ApiParam({ name: 'permissionId', type: 'String' })
  @Get('permission/:permissionId')
  findByPermission(@Param('permissionId') permissionId: Uuid) {
    return this.permissionService.findByRole(permissionId);
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
