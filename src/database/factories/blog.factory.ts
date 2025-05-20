import { BlogEntity } from '@/api/blog/entities/blog.entity';
import { SYSTEM_USER_ID } from '@/constants/app.constant';
import { setSeederFactory } from 'typeorm-extension';

export default setSeederFactory(BlogEntity, (fake) => {
  const blog = new BlogEntity();

  blog.title = fake.lorem.sentence();
  blog.slug = fake.lorem.slug();
  blog.description = fake.lorem.sentence();
  blog.content = fake.lorem.paragraphs();
  blog.createdBy = SYSTEM_USER_ID;
  blog.updatedBy = SYSTEM_USER_ID;

  return blog;
});
