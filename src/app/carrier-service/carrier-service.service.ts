import { Injectable, HttpService } from '@nestjs/common';
import { map } from 'rxjs/operators';

import { InjectRepository } from '@nestjs/typeorm';

import { Carrier } from './carrier-service.entity';
import { CarrierRepository } from './carrier-service.repository';
import { CreateCarrierDto } from './dto/create-carrier-service.dto';
import { UpdateCarrierDto } from './dto/update-carrier-service.dto';
import { ErrorResult, NotFoundResult, BadRequestResult, InternalServerErrorResult } from '../common/error-manager/errors';
import { ErrorCode } from '../common/error-manager/error-codes';
import { User } from '../user/user.entity';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { UpdateUserDto } from '../user/dto/update-user.dto';
import { FilterCarrierDto } from './dto/filter-carrier-service.dto';
import { UserService } from '../user/user.service';

@Injectable()
export class CarrierService {
    constructor(
        //@InjectRepository(Carrier)  
        private readonly httpService: HttpService,
        private readonly carrierRepository: CarrierRepository,
        private readonly userService: UserService,
    ) { }

    async create(carrierDto: CreateCarrierDto): Promise<Carrier> {
        return new Promise((resolve: (result: Carrier) => void, reject: (reason: ErrorResult) => void): void => {

            this.carrierRepository.createCarrier(carrierDto).then((carrier: Carrier) => {
                resolve(carrier);
                /*this.userService.create(carrier.id).then((user: User) => {
                }).catch((error) => {
                    reject(new InternalServerErrorResult(ErrorCode.GeneralError, error));
                });*/
            }).catch((error) => {
                reject(new InternalServerErrorResult(ErrorCode.GeneralError, error));
            });

        });
    }

    getQuotes() {
        return this.httpService.get('http://quotesondesign.com/wp-json/posts')
            .pipe(
                map(response => response.data)
            );
    }

    getAcccesToken(accessTokenRequestUrl: string, accessTokenPayload: any) {
        return this.httpService.post(accessTokenRequestUrl, accessTokenPayload)
            .pipe(
                map(response => response.data)
            );
    }

    update(id: string, carrierDto: UpdateCarrierDto): Promise<Carrier> {
        return new Promise((resolve: (result: Carrier) => void, reject: (reason: ErrorResult) => void): void => {
            this.carrierRepository.getCarrier(id).then((carrier: Carrier) => {
                if (!carrier) {
                    reject(new NotFoundResult(ErrorCode.UnknownEntity, 'There is no carrier with the specified ID!'));
                    return;
                }
                this.carrierRepository.updateCarrier(id, carrierDto).then((carrier: Carrier) => {
                    resolve(carrier);
                }).catch((error) => {
                    reject(new InternalServerErrorResult(ErrorCode.GeneralError, error));
                });
            }).catch((error) => {
                reject(new InternalServerErrorResult(ErrorCode.GeneralError, error));
            });
        });
    }

    async getCarrier(id: string): Promise<Carrier> {
        return new Promise((resolve: (result: Carrier) => void, reject: (reason: ErrorResult) => void): void => {
            this.carrierRepository.getCarrier(id).then((carrier: Carrier) => {
                if (!carrier) {
                    reject(new NotFoundResult(ErrorCode.UnknownEntity, 'There is no carrier with the specified ID!'));
                    return;
                }
                resolve(carrier);
            }).catch((error) => {
                reject(new InternalServerErrorResult(ErrorCode.GeneralError, error));
            });
        });
    }

    getCompanies(user: User, filter: FilterCarrierDto): Promise<Carrier[]> {
        return new Promise((resolve: (result: Carrier[]) => void, reject: (reason: ErrorResult) => void): void => {
            this.carrierRepository.getCompanies(user, filter).then((companies: Carrier[]) => {
                resolve(companies);
            }).catch((error) => {
                reject(new InternalServerErrorResult(ErrorCode.GeneralError, error));
            });
        });
    }

    delete(id: string): Promise<Carrier> {
        return new Promise((resolve: (result: Carrier) => void, reject: (reason: ErrorResult) => void): void => {
            this.carrierRepository.getCarrier(id).then((carrier: Carrier) => {
                if (!carrier) {
                    reject(new NotFoundResult(ErrorCode.UnknownEntity, 'There is no carrier with the specified ID!'));
                    return;
                }
                this.carrierRepository.remove(carrier).then((carrier: Carrier) => {
                    if (!carrier) {
                        reject(new BadRequestResult(ErrorCode.UnknownError, 'It can not be eliminated!'));
                        return;
                    }
                    resolve(carrier);
                });
            }).catch((error) => {
                reject(new InternalServerErrorResult(ErrorCode.GeneralError, error));
            });
        });
    }
}
