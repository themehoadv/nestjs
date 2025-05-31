import { Uuid } from '@/common/types/common.type';
import {
  EmailField,
  PasswordField,
  StringField,
  StringFieldOptional,
  UUIDFieldOptional,
} from '@/decorators/field.decorators';
import { lowerCaseTransformer } from '@/utils/transformers/lower-case.transformer';
import { Transform } from 'class-transformer';

export class CreateUserReqDto {
  @StringField({ example: 'user1' })
  @Transform(lowerCaseTransformer)
  username: string;

  @EmailField({ example: 'user@example.com' })
  email: string;

  @PasswordField({ example: '123456789admin' })
  password: string;

  @StringFieldOptional({ example: "I'm a backend developer" })
  bio?: string;

  @StringFieldOptional({ example: 'https://i.pravatar.cc/150?img=5' })
  avatar?: string;

  @UUIDFieldOptional({ example: 'e5768aef-39d4-456a-a4b2-ce3433dabbf3' })
  roleId?: Uuid;
}
