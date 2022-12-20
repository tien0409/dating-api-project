import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class CreateRelationshipTypeDTO {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsBoolean()
  @IsNotEmpty()
  isDefault: boolean;

  @IsString()
  description: string;
}
