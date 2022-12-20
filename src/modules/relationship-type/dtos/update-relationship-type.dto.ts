import {IsBoolean, IsNotEmpty, IsString} from 'class-validator';

export class UpdateRelationshipTypeDTO {

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsBoolean()
  @IsNotEmpty()
  isDefault: boolean;

  @IsString()
  description: string;
}
