import { IsString, IsIn, IsByteLength, IsEmail, MinLength } from 'class-validator';

export class LoginUserDto {
   
    id?: string;
    
    isDeleted?: boolean;

    email?: string;

    firstName?: string;

    language?: string;    

    lastLogin?: Date;    

    lastName?: string;    

    password?: string;

    phone?: string;  

    verificationCode?: string;

    region?: string;    

    comuna?: string;

    address?: string;

    zip?: string;

    shopUrl?: string;

    userApiChile?: string;

    passwordApiChile?: string;

    idApiChile?: string;
    
    createdAt?: Date;
    
    updatedAt?: Date;

    redirect?: string;

    newUser?: boolean;

    hmac?: boolean;

    profile?: boolean;
}

export class UserDto {

    id?: string;

    redirect?: string;

    newUser?: boolean;

    hmac?: boolean;

    shopUrl?: string;

}