import { IsString, IsIn, IsByteLength, IsEmail, MinLength } from 'class-validator';

export class CreateUserDto {

    @IsString()
    accessToken?: string;

    @IsString()
    email?: string;

    @IsString()
    firstName?: string;

    @IsString()
    language?: string;
    
    @IsString()
    lastLogin?: Date;
    
    @IsString()
    lastName?: string;
    
    @IsString()
    password?: string;

    @IsString()
    phone?: string;
  
    @IsString()
    verificationCode?: string;

    @IsString()
    region?: string;
    
    @IsString()
    comuna?: string;

    @IsString()
    address?: string;

    @IsString()
    zip?: string;

    @IsString()
    shopUrl?: string;

    @IsString()
    userApiChile?: string;

    @IsString()
    passwordApiChile?: string;

    @IsString()
    idApiChile?: string;

    newUser?: boolean;

    profile?: boolean;

    @IsString()
    rut?: string;

}