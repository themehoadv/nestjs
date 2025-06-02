import {
  PermissionAction,
  PermissionEntity,
} from '@/api/permission/entities/permission.entity';
import { RoleEntity } from '@/api/role/entities/role.entity';
import { RoleType } from '@/constants/role-type';
import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';

export class PermissionSeeder implements Seeder {
  track = false;

  public async run(dataSource: DataSource): Promise<any> {
    const entities = ['User'];
    const actions = Object.values(PermissionAction);
    const permissionRepository = dataSource.getRepository(PermissionEntity);
    const roleRepository = dataSource.getRepository(RoleEntity);

    for (const entity of entities) {
      for (const action of actions) {
        const permission = permissionRepository.create({
          entity,
          actions: [action],
        });
        await permissionRepository.save(permission);
      }
    }

    // Assign permissions to roles
    const adminRole = await roleRepository.findOne({
      where: { code: RoleType.Admin },
    });
    const allPermissions = await permissionRepository.find();
    adminRole.permissions = allPermissions;
    await roleRepository.save(adminRole);
  }
}
