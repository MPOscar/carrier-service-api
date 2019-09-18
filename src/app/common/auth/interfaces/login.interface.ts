import { UserDto } from 'src/app/user/dto/login-user.dto';

export interface ILogin {
    readonly user: UserDto;
    readonly token: string;
    readonly expiresIn: number;
}
