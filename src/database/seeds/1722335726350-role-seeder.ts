import { RoleEntity } from '@/api/role/entities/role.entity';
import { RoleType } from '@/constants/role-type';
import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';

export class RoleSeeder implements Seeder {
  track = false;

  public async run(dataSource: DataSource): Promise<any> {
    const roleRepository = dataSource.getRepository(RoleEntity);
    const roleAdmin = await roleRepository.findOneBy({ code: RoleType.Admin });
    if (!roleAdmin) {
      await roleRepository.insert([
        {
          name: 'Quản trị viên',
          code: RoleType.Admin,
          remark: 'Quản trị viên hệ thống',
        },
        {
          name: 'Người dùng',
          code: RoleType.Common,
          remark: 'Người dùng thông thường',
        },
      ]);
    }
  }
}
