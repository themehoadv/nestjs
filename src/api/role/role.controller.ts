import { OffsetPaginatedListDto } from '@/common/dto/offset-pagination/paginatedList.dto';
import { Uuid } from '@/common/types/common.type';
import { ApiAuth } from '@/decorators/http.decorators';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { CreateRoleReqDto } from './dto/create-role.req.dto';
import { ListRoleReqDto } from './dto/list-role.req.dto';
import { RoleResDto } from './dto/role.res.dto';
import { UpdateRoleReqDto } from './dto/update-role.req.dto';
import { RoleService } from './role.service';

@ApiTags('roles')
@Controller({
  path: 'roles',
  version: '1',
})
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  @ApiAuth({
    type: RoleResDto,
    summary: 'Create role',
    statusCode: HttpStatus.CREATED,
  })
  async createRole(
    @Body() createRoleDto: CreateRoleReqDto,
  ): Promise<RoleResDto> {
    return await this.roleService.create(createRoleDto);
  }

  @Get('/all')
  @ApiAuth({
    summary: 'All roles',
  })
  async findAllRoles(): Promise<RoleResDto[]> {
    return await this.roleService.findAll();
  }

  @Get()
  @ApiAuth({
    type: OffsetPaginatedListDto<RoleResDto>,
    summary: 'List roles',
  })
  async findRoleList(
    @Query() reqDto: ListRoleReqDto,
  ): Promise<OffsetPaginatedListDto<RoleResDto>> {
    return await this.roleService.findList(reqDto);
  }

  @Get(':id')
  @ApiAuth({ type: RoleResDto, summary: 'Find role by id' })
  @ApiParam({ name: 'id', type: 'String' })
  async findRole(@Param('id', ParseUUIDPipe) id: Uuid): Promise<RoleResDto> {
    return await this.roleService.findOne(id);
  }

  @Patch(':id')
  @ApiAuth({ type: RoleResDto, summary: 'Update role' })
  @ApiParam({ name: 'id', type: 'String' })
  updateRole(
    @Param('id', ParseUUIDPipe) id: Uuid,
    @Body() reqDto: UpdateRoleReqDto,
  ): Promise<RoleResDto> {
    return this.roleService.update(id, reqDto);
  }

  @Delete(':id')
  @ApiAuth({
    type: String,
    summary: 'Delete role',
  })
  @ApiParam({ name: 'id', type: 'String' })
  removeRole(@Param('id', ParseUUIDPipe) id: Uuid): Promise<string> {
    return this.roleService.remove(id);
  }
}
