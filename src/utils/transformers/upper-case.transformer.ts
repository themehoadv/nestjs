import { type TransformFnParams } from 'class-transformer';

export const upperCaseTransformer = (params: TransformFnParams): string =>
  params.value?.toUpperCase().trim();
