import { PostEntity } from '@/api/post/entities/post.entity';
import { setSeederFactory } from 'typeorm-extension';

export default setSeederFactory(PostEntity, (fake) => {
  const post = new PostEntity();

  post.title = fake.lorem.sentence();
  post.slug = fake.lorem.slug();
  post.description = fake.lorem.sentence();
  post.content = fake.lorem.paragraphs();

  return post;
});
