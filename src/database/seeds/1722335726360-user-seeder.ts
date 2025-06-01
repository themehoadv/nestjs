import { RoleEntity } from '@/api/role/entities/role.entity';
import { UserEntity } from '@/api/user/entities/user.entity';
import { RoleType } from '@/constants/role-type';
import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';

export class UserSeeder1722335726360 implements Seeder {
  track = false;

  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<any> {
    const userRepository = dataSource.getRepository(UserEntity);
    const roleRepository = dataSource.getRepository(RoleEntity);

    const [adminRole, userRole] = await Promise.all([
      roleRepository.findOneBy({ code: RoleType.Admin }),
      roleRepository.findOneBy({ code: RoleType.Common }),
    ]);

    if (!adminRole || !userRole) {
      throw new Error('Roles not found. Run RoleSeeder first!');
    }

    const adminUser = await userRepository.findOneBy({ username: 'admin' });
    if (!adminUser) {
      await userRepository.insert(
        new UserEntity({
          username: 'admin',
          email: 'admin@example.com',
          password: '123456789admin',
          bio: "hello, i'm a backend developer",
          avatar: 'https://i.pravatar.cc/150?img=5',
          roleId: adminRole.id,
        }),
      );
    }

    const userFactory = factoryManager.get(UserEntity);
    await userFactory.saveMany(5, {
      roleId: userRole.id,
    });
  }
}
