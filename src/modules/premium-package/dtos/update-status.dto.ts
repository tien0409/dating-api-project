import { IsBoolean } from 'class-validator';

export class UpdateStatusDTO {
  @IsBoolean()
  active: boolean;
}
