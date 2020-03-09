import { EntityRepository, Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
    async createUser(userDto: CreateUserDto) {
        const user: User = this.create();
        user.firstName = userDto.firstName;
        user.lastName = userDto.lastName;
        user.email = userDto.email;
        user.accessToken = userDto.accessToken;
        const salt: string = bcrypt.genSaltSync(10);
        //user.password = await bcrypt.hash(userDto.password, salt);
        user.language = userDto.language;
        user.phone = userDto.phone;
        user.region = userDto.region;
        user.comuna = userDto.comuna;
        user.address = userDto.address;
        user.zip = userDto.zip;
        user.shopUrl = userDto.shopUrl;
        user.userApiChile = userDto.userApiChile;
        user.passwordApiChile = userDto.passwordApiChile;
        user.idApiChile = userDto.idApiChile;
        user.profile = userDto.profile;
        user.rut = userDto.rut;
        user.labelFormat = userDto.labelFormat;
        user.recharge = userDto.recharge;
        user.updatedAt = new Date();
        user.createdAt = new Date();
        return this.save(user);
    }

    async updateUser(id: string, userDto: UpdateUserDto) {
        const user: User = await this.getUser(id);
        user.isDeleted = userDto.isDeleted ? userDto.isDeleted : user.isDeleted;
        user.firstName = userDto.firstName ? userDto.firstName : user.firstName;
        user.lastName = userDto.lastName ? userDto.lastName : user.lastName;
        user.email = userDto.email ? userDto.email : user.email;
        user.phone = userDto.phone ? userDto.phone : user.phone;
        user.language = userDto.language ? userDto.language : user.language;
        user.region = userDto.region ? userDto.region : user.region;
        user.comuna = userDto.comuna ? userDto.comuna : user.comuna;
        user.address = userDto.address ? userDto.address : user.address;
        user.zip = userDto.zip ? userDto.zip : user.zip;
        user.shopUrl = userDto.shopUrl ? userDto.shopUrl : user.shopUrl;
        user.profile = userDto.profile ? userDto.profile : user.profile;
        user.userApiChile = userDto.userApiChile
            ? userDto.userApiChile
            : user.userApiChile;
        user.passwordApiChile = userDto.passwordApiChile
            ? userDto.passwordApiChile
            : user.passwordApiChile;
        user.idApiChile = userDto.idApiChile
            ? userDto.idApiChile
            : user.idApiChile;
        user.correlativeNumber = userDto.correlativeNumber;
        user.rut = userDto.rut;
        user.labelFormat = userDto.labelFormat;
        user.recharge = userDto.recharge;
        user.updatedAt = new Date();
        return this.save(user);
    }

    async signIn(email: string, password: string) {
        let user: User = await this.getUserByEmail(email);
        if (!user) {
            return user;
        }
        const isPasswordMatching = await bcrypt.compare(
            password,
            user.password,
        );
        if (!isPasswordMatching) {
            user = undefined;
        }
        return user;
    }

    getUser(id: string) {
        return this.createQueryBuilder('user')
            .select()
            .where('user.id = :id', { id })
            .andWhere('user.isDeleted = false')
            .getOne();
    }

    getUsers() {
        return this.createQueryBuilder('user')
            .select()
            .where('user.isDeleted = false')
            .getMany();
    }

    getUserByEmail(shop: string) {
        return this.createQueryBuilder('user')
            .select()
            .where('user.shopUrl = :shop', { shop })
            .andWhere('user.isDeleted = false')
            .getOne();
    }

    async deleteUser(user: User) {
        //user.isDeleted = true;
        user.updatedAt = new Date();
        return this.save(user);
    }
}
