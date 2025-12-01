import { PartialType } from '@nestjs/mapped-types';
import { CreateSubItemDto } from './create-subitem.dto';
import { OmitType } from '@nestjs/mapped-types';

export class UpdateSubItemDto extends PartialType(
  OmitType(CreateSubItemDto, ['itemId'] as const),
) {}
