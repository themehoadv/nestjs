import { RoleEntity } from '@/api/role/entities/role.entity';
import { RoleType } from '@/constants/role-type';
import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';

export class RoleSeeder implements Seeder {
  track = false;

  public async run(dataSource: DataSource): Promise<any> {
    const roleRepository = dataSource.getRepository(RoleEntity);
    const roleAdmin = await roleRepository.findOneBy({ name: RoleType.ADMIN });
    if (!roleAdmin) {
      await roleRepository.insert([
        {
          name: RoleType.ADMIN,
          description: 'Quản trị viên hệ thống',
        },
        {
          name: RoleType.USER,
          description: 'Người dùng thông thường',
        },
      ]);
    }
  }
}
