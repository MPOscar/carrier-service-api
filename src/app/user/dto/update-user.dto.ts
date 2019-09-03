import { IsString, IsIn, IsByteLength, IsEmail, MinLength } from 'class-validator';

export class UpdateUserDto {
    @IsEmail()
    email: string;

    @IsString()
    firstName: string;

    @IsString()
    language: string;
    
    @IsString()
    lastLogin?: Date;
    
    @IsString()
    lastName: string;
    
    @IsString()
    password: string;

    @IsString()
    phone: string;
  
    @IsString()
    verificationCode: string;

    @IsString()
    region: string;
    
    @IsString()
    comuna: string;

    @IsString()
    address: string;

    @IsString()
    zip: string;

    @IsString()
    @IsByteLength(1, 100, {
        message: "Invalid First Name length"
    })
    shopName: string;

    @IsString()
    userApiChile: string;

    @IsString()
    passwordApiChile: string;

    @IsString()
    idApiChile: string;

    createdAt: Date;

    updatedAt: Date;
}