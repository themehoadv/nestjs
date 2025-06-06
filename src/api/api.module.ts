import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { HealthModule } from './health/health.module';
import { HomeModule } from './home/home.module';
import { MediaModule } from './media/media.module';
import { PermissionModule } from './permission/permission.module';
import { PostModule } from './post/post.module';
import { RoleModule } from './role/role.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    PermissionModule,
    MediaModule,
    RoleModule,
    UserModule,
    AuthModule,
    PostModule,
    HomeModule,
    HealthModule,
  ],
})
export class ApiModule {}
