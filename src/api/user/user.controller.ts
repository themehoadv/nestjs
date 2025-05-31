import { CursorPaginatedDto } from '@/common/dto/cursor-pagination/paginated.dto';
import { OffsetPaginatedListDto } from '@/common/dto/offset-pagination/paginatedList.dto';
import { SuccessDto } from '@/common/dto/sucess.dto';
import { Uuid } from '@/common/types/common.type';
import { RoleType } from '@/constants/role-type';
import { CurrentUser } from '@/decorators/current-user.decorator';
import { ApiAuth } from '@/decorators/http.decorators';
import { Roles } from '@/decorators/roles.decorator';
import { RolesGuard } from '@/guards/roles.guard';
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
  UseGuards,
} from '@nestjs/common';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { CreateUserReqDto } from './dto/create-user.req.dto';
import { ListUserReqDto } from './dto/list-user.req.dto';
import { LoadMoreUsersReqDto } from './dto/load-more-users.req.dto';
import { UpdateUserReqDto } from './dto/update-user.req.dto';
import { UserResDto } from './dto/user.res.dto';
import { UserService } from './user.service';

@UseGuards(RolesGuard)
@ApiTags('users')
@Controller({
  path: 'users',
  version: '1',
})
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Roles([RoleType.USER])
  @ApiAuth({
    type: SuccessDto<UserResDto>,
    summary: 'Get current user',
  })
  @Get('me')
  async getCurrentUser(
    @CurrentUser('id') userId: Uuid,
  ): Promise<SuccessDto<UserResDto>> {
    return await this.userService.findOne(userId);
  }

  @Roles([])
  @Post()
  @ApiAuth({
    type: SuccessDto<UserResDto>,
    summary: 'Create user',
    statusCode: HttpStatus.CREATED,
  })
  async createUser(
    @Body() createUserDto: CreateUserReqDto,
  ): Promise<SuccessDto<UserResDto>> {
    return await this.userService.create(createUserDto);
  }

  @Roles([])
  @Get()
  @ApiAuth({
    type: UserResDto,
    summary: 'List users',
    isPaginated: true,
  })
  async findAllUsers(
    @Query() reqDto: ListUserReqDto,
  ): Promise<OffsetPaginatedListDto<UserResDto>> {
    return await this.userService.findAll(reqDto);
  }

  @Roles([])
  @Get('/load-more')
  @ApiAuth({
    type: UserResDto,
    summary: 'Load more users',
    isPaginated: true,
    paginationType: 'cursor',
  })
  async loadMoreUsers(
    @Query() reqDto: LoadMoreUsersReqDto,
  ): Promise<CursorPaginatedDto<UserResDto>> {
    return await this.userService.loadMoreUsers(reqDto);
  }

  @Roles([])
  @Get(':id')
  @ApiAuth({ type: SuccessDto<UserResDto>, summary: 'Find user by id' })
  @ApiParam({ name: 'id', type: 'String' })
  async findUser(
    @Param('id', ParseUUIDPipe) id: Uuid,
  ): Promise<SuccessDto<UserResDto>> {
    return await this.userService.findOne(id);
  }

  @Roles([])
  @Patch(':id')
  @ApiAuth({ type: SuccessDto<UserResDto>, summary: 'Update user' })
  @ApiParam({ name: 'id', type: 'String' })
  updateUser(
    @Param('id', ParseUUIDPipe) id: Uuid,
    @Body() reqDto: UpdateUserReqDto,
  ): Promise<SuccessDto<UserResDto>> {
    return this.userService.update(id, reqDto);
  }

  @Roles([])
  @Delete(':id')
  @ApiAuth({
    type: SuccessDto<{ id: Uuid }>,
    summary: 'Delete user',
    errorResponses: [400, 401, 403, 404, 500],
  })
  @ApiParam({ name: 'id', type: 'String' })
  removeUser(
    @Param('id', ParseUUIDPipe) id: Uuid,
  ): Promise<SuccessDto<{ id: Uuid }>> {
    return this.userService.remove(id);
  }
}
