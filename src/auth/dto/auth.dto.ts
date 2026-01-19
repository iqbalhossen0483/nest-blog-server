import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Max,
  Min,
  Validate,
} from 'class-validator';

export class RegisterDto {
  @IsNotEmpty({ message: 'Name is required' })
  @IsString({ message: 'Name must be a string' })
  @Max(50, { message: 'Name must be at most 50 characters long' })
  @Min(3, { message: 'Name must be at least 3 characters long' })
  name: string;

  @IsNotEmpty({ message: 'Email is required' })
  @IsString({ message: 'Email must be a string' })
  @IsEmail()
  email: string;

  @IsNotEmpty({ message: 'Password is required' })
  @Min(6, { message: 'Password must be at least 6 characters long' })
  @Validate(
    (value: string) => {
      const regex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
      return regex.test(value);
    },
    {
      message:
        'Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character',
    },
  )
  password: string;
}

export class LoginDto {
  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail()
  email: string;

  @IsNotEmpty({ message: 'Password is required' })
  @Min(6, { message: 'Password must be at least 6 characters long' })
  @Validate(
    (value: string) => {
      const regex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
      return regex.test(value);
    },
    {
      message:
        'Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character',
    },
  )
  password: string;
}
