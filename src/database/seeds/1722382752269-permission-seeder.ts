import { PermissionEntity } from '@/api/permission/entities/permission.entity';
import { ResourceEntity } from '@/api/permission/entities/resource.entity';
import { RoleEntity } from '@/api/role/entities/role.entity';
import { RoleType } from '@/constants/role-type';
import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';

export class PermissionSeeder implements Seeder {
  track = false;

  public async run(dataSource: DataSource): Promise<any> {
    const roleRepository = dataSource.getRepository(RoleEntity);
    const resourceRepository = dataSource.getRepository(ResourceEntity);
    const permissionRepository = dataSource.getRepository(PermissionEntity);

    // Tạo các resource mẫu
    const resources = [
      { name: 'user', description: 'Quản lý người dùng' },
      { name: 'role', description: 'Quản lý vai trò' },
      { name: 'permission', description: 'Quản lý quyền hạn' },
      { name: 'category', description: 'Quản lý danh mục' },
      { name: 'post', description: 'Quản lý bài viết' },
    ];

    await resourceRepository.insert(resources);

    // Lấy các role đã có trong database
    const adminRole = await roleRepository.findOneBy({ code: RoleType.Admin });
    const commonRole = await roleRepository.findOneBy({
      code: RoleType.Common,
    });

    if (!adminRole || !commonRole) {
      throw new Error('Roles not found. Please run RoleSeeder first.');
    }

    // Lấy tất cả các resource đã tạo
    const allResources = await resourceRepository.find();

    // Tạo permission cho admin (full quyền trên tất cả resource)
    const adminPermissions = allResources.map((resource) => ({
      role: adminRole,
      resource: resource,
      canCreate: true,
      canRead: true,
      canUpdate: true,
      canDelete: true,
    }));

    // Tạo permission cho common user (chỉ read trên một số resource)
    const commonUserPermissions = allResources.map((resource) => {
      const isAllowed = ['post', 'category'].includes(resource.name);
      return {
        role: commonRole,
        resource: resource,
        canCreate: false,
        canRead: isAllowed,
        canUpdate: false,
        canDelete: false,
      };
    });

    // Thêm permissions vào database
    await permissionRepository.insert([
      ...adminPermissions,
      ...commonUserPermissions,
    ]);
  }
}
