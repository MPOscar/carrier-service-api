import { Injectable, HttpService } from '@nestjs/common';
import { map } from 'rxjs/operators';

import { InjectRepository } from '@nestjs/typeorm';

import { Manifest } from './manifest.entity';
import { ManifestRepository } from './manifest.repository';
import { ManifestDto } from './dto/create-manifest.dto';
import { UpdateManifestDto } from './dto/update-manifest.dto';
import {
    ErrorResult,
    NotFoundResult,
    BadRequestResult,
    InternalServerErrorResult,
} from '../common/error-manager/errors';
import { ErrorCode } from '../common/error-manager/error-codes';
import { User } from '../user/user.entity';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { UpdateUserDto } from '../user/dto/update-user.dto';
import { UserService } from '../user/user.service';
import { OrderService } from '../order/order.service';
import { Order } from '../order/order.entity';

@Injectable()
export class ManifestService {
    constructor(
        //@InjectRepository(Manifest)
        private readonly httpService: HttpService,
        private readonly ManifestRepository: ManifestRepository,
        private readonly userService: UserService,
        private readonly orderService: OrderService,
    ) {}

    async create(manifestDto: ManifestDto, orderId: string): Promise<Manifest> {
        return new Promise(
            async (
                resolve: (result: Manifest) => void,
                reject: (reason: ErrorResult) => void,
            ): Promise<void> => {
                const order: Order = await this.orderService.getOrder(orderId);
                this.ManifestRepository.createManifest(manifestDto, order)
                    .then((manifest: Manifest) => {
                        resolve(manifest);
                    })
                    .catch(error => {
                        reject(
                            new InternalServerErrorResult(
                                ErrorCode.GeneralError,
                                error,
                            ),
                        );
                    });
            },
        );
    }

    getQuotes() {
        return this.httpService
            .get('http://quotesondesign.com/wp-json/posts')
            .pipe(map(response => response.data));
    }

    getAcccesToken(accessTokenRequestUrl: string, accessTokenPayload: any) {
        return this.httpService
            .post(accessTokenRequestUrl, accessTokenPayload)
            .pipe(map(response => response.data));
    }

    update(id: string, manifestDto: ManifestDto): Promise<Manifest> {
        return new Promise(
            (
                resolve: (result: Manifest) => void,
                reject: (reason: ErrorResult) => void,
            ): void => {
                this.ManifestRepository.getManifest(id)
                    .then((Manifest: Manifest) => {
                        if (!Manifest) {
                            reject(
                                new NotFoundResult(
                                    ErrorCode.UnknownEntity,
                                    'There is no Manifest with the specified ID!',
                                ),
                            );
                            return;
                        }
                        this.ManifestRepository.updateManifest(id, manifestDto)
                            .then((Manifest: Manifest) => {
                                resolve(Manifest);
                            })
                            .catch(error => {
                                reject(
                                    new InternalServerErrorResult(
                                        ErrorCode.GeneralError,
                                        error,
                                    ),
                                );
                            });
                    })
                    .catch(error => {
                        reject(
                            new InternalServerErrorResult(
                                ErrorCode.GeneralError,
                                error,
                            ),
                        );
                    });
            },
        );
    }

    async getManifest(id: string): Promise<Manifest> {
        return new Promise(
            (
                resolve: (result: Manifest) => void,
                reject: (reason: ErrorResult) => void,
            ): void => {
                this.ManifestRepository.getManifest(id)
                    .then((Manifest: Manifest) => {
                        if (!Manifest) {
                            reject(
                                new NotFoundResult(
                                    ErrorCode.UnknownEntity,
                                    'There is no Manifest with the specified ID!',
                                ),
                            );
                            return;
                        }
                        resolve(Manifest);
                    })
                    .catch(error => {
                        reject(
                            new InternalServerErrorResult(
                                ErrorCode.GeneralError,
                                error,
                            ),
                        );
                    });
            },
        );
    }

    delete(id: string): Promise<Manifest> {
        return new Promise(
            (
                resolve: (result: Manifest) => void,
                reject: (reason: ErrorResult) => void,
            ): void => {
                this.ManifestRepository.getManifest(id)
                    .then((Manifest: Manifest) => {
                        if (!Manifest) {
                            reject(
                                new NotFoundResult(
                                    ErrorCode.UnknownEntity,
                                    'There is no Manifest with the specified ID!',
                                ),
                            );
                            return;
                        }
                        this.ManifestRepository.remove(Manifest).then(
                            (Manifest: Manifest) => {
                                if (!Manifest) {
                                    reject(
                                        new BadRequestResult(
                                            ErrorCode.UnknownError,
                                            'It can not be eliminated!',
                                        ),
                                    );
                                    return;
                                }
                                resolve(Manifest);
                            },
                        );
                    })
                    .catch(error => {
                        reject(
                            new InternalServerErrorResult(
                                ErrorCode.GeneralError,
                                error,
                            ),
                        );
                    });
            },
        );
    }
}
