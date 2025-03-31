import { IsString, IsEmail, MinLength } from "class-validator";

export class SignInDto {
  @IsString()
  @MinLength(3)
  username: string;

  @IsString()
  @MinLength(6)
  password: string;
}

export class SignUpDto {
  @IsString()
  @MinLength(3)
  username: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsEmail()
  email: string;
}

export class RefreshTokenDto {
  @IsString()
  refresh_token: string;
}
