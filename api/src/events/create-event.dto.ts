import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';

export class Tag {
  @IsNotEmpty()
  @IsString()
  readonly key: string;

  @IsNotEmpty()
  @IsString()
  readonly value: string;
}

export class CreateEventDto {
  @IsNotEmpty()
  @IsUUID()
  readonly projectId: string;

  @IsNotEmpty()
  @IsUUID()
  readonly channelId: string;

  @IsNotEmpty()
  @IsString()
  readonly event: string;

  // optional
  @IsOptional()
  @IsString()
  readonly userId: string;

  @IsOptional()
  @IsString()
  readonly description: string;

  @IsOptional()
  @IsString()
  readonly icon: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Tag)
  readonly tags: Tag[];
}
