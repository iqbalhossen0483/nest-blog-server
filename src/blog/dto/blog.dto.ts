import {
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class createBlogDto {
  @IsNotEmpty({ message: 'Title is required' })
  @IsString({ message: 'Title must be a string' })
  @MinLength(3, { message: 'Title must be at least 3 characters long' })
  @MaxLength(50, { message: 'Title must be at most 50 characters long' })
  title: string;

  @IsNotEmpty({ message: 'Description is required' })
  @IsString({ message: 'Description must be a string' })
  @MinLength(3, { message: 'Description must be at least 3 characters long' })
  @MaxLength(1000, {
    message: 'Description must be at most 1000 characters long',
  })
  description: string;

  @IsNotEmpty({ message: 'Author is required' })
  @IsNumber({ allowNaN: false }, { message: 'Author must be a number' })
  author: number;
}

export class createCommentDto {
  @IsNotEmpty({ message: 'Text is required' })
  @IsString({ message: 'Text must be a string' })
  @MinLength(3, { message: 'Text must be at least 3 characters long' })
  @MaxLength(50, {
    message: 'Text must be at most 50 characters long',
  })
  text: string;

  @IsNotEmpty({ message: 'Author is required' })
  @IsNumber({ allowNaN: false }, { message: 'Author must be a number' })
  author: number;

  @IsNotEmpty({ message: 'Blog id is required' })
  @IsNumber({ allowNaN: false }, { message: 'Blog must be a number' })
  blogId: number;
}
