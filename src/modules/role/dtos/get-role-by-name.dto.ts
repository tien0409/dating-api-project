import { IsNotEmpty, IsString } from 'class-validator';

export class GetRoleByNameDTO {
  @IsString()
  @IsNotEmpty()
  name: string;
}
