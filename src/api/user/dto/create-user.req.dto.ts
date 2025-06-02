import { Uuid } from '@/common/types/common.type';
import {
  EmailField,
  PasswordField,
  StringField,
  StringFieldOptional,
  UUIDField,
} from '@/decorators/field.decorators';
import { lowerCaseTransformer } from '@/utils/transformers/lower-case.transformer';
import { Transform } from 'class-transformer';

export class CreateUserReqDto {
  @StringField({ example: 'user1' })
  @Transform(lowerCaseTransformer)
  username: string;

  @EmailField({ example: 'user1@example.com' })
  email: string;

  @PasswordField({ example: '123456789user' })
  password: string;

  @UUIDField({ example: 'ae389ea4-3106-4865-aee4-820bd21edb7d' })
  roleId: Uuid;

  @StringFieldOptional({ example: "I'm a backend developer" })
  bio?: string;

  @StringFieldOptional({ example: 'https://i.pravatar.cc/150?img=5' })
  avatar?: string;

  @StringFieldOptional({ example: '0987654321' })
  phone?: string;
}
