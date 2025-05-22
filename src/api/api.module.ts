import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { BlogModule } from './blog/blog.module';
import { HealthModule } from './health/health.module';
import { HomeModule } from './home/home.module';
// import { MediaModule } from './media/media.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    UserModule,
    HealthModule,
    AuthModule,
    HomeModule,
    BlogModule,
    // MediaModule,
  ],
})
export class ApiModule {}
