import { OffsetPaginatedListDto } from '@/common/dto/offset-pagination/paginatedList.dto';
import { SuccessDto } from '@/common/dto/sucess.dto';
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
    type: SuccessDto<RoleResDto>,
    summary: 'Create role',
    statusCode: HttpStatus.CREATED,
  })
  async createRole(
    @Body() createRoleDto: CreateRoleReqDto,
  ): Promise<SuccessDto<RoleResDto>> {
    return await this.roleService.create(createRoleDto);
  }

  @Get('/all')
  @ApiAuth({
    type: SuccessDto<RoleResDto[]>,
    summary: 'All roles',
  })
  async findAllRoles(): Promise<SuccessDto<RoleResDto[]>> {
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
  @ApiAuth({ type: SuccessDto<RoleResDto>, summary: 'Find role by id' })
  @ApiParam({ name: 'id', type: 'String' })
  async findRole(
    @Param('id', ParseUUIDPipe) id: Uuid,
  ): Promise<SuccessDto<RoleResDto>> {
    return await this.roleService.findOne(id);
  }

  @Patch(':id')
  @ApiAuth({ type: SuccessDto<RoleResDto>, summary: 'Update role' })
  @ApiParam({ name: 'id', type: 'String' })
  updateRole(
    @Param('id', ParseUUIDPipe) id: Uuid,
    @Body() reqDto: UpdateRoleReqDto,
  ): Promise<SuccessDto<RoleResDto>> {
    return this.roleService.update(id, reqDto);
  }

  @Delete(':id')
  @ApiAuth({
    type: SuccessDto<{ id: Uuid }>,
    summary: 'Delete role',
    errorResponses: [400, 401, 403, 404, 500],
  })
  @ApiParam({ name: 'id', type: 'String' })
  removeRole(
    @Param('id', ParseUUIDPipe) id: Uuid,
  ): Promise<SuccessDto<string>> {
    return this.roleService.remove(id);
  }
}
