import { IsNotEmpty, IsString, Length } from 'class-validator';

export class Enable2FaDto {
  @IsString()
  @IsNotEmpty()
  secret: string;

  @IsString()
  @Length(6, 6, { message: '2FA code must be exactly 6 digits.' })
  code: string;
}

export class Verify2FaDto {
  @IsString()
  @Length(6, 6, { message: '2FA code must be exactly 6 digits.' })
  code: string;
}

export class Login2FaDto {
  @IsString()
  @IsNotEmpty({ message: 'Pre-authentication token is required.' })
  preAuthToken: string;

  @IsString()
  @Length(6, 6, { message: '2FA code must be exactly 6 digits.' })
  code: string;
}
