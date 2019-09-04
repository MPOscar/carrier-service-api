import { Injectable, HttpService } from '@nestjs/common';
import { map } from 'rxjs/operators';

import { InjectRepository } from '@nestjs/typeorm';

import { Label } from './label.entity';
import { LabelRepository } from './label.repository';
import { CreateLabelDto } from './dto/create-label.dto';
import { UpdateLabelDto } from './dto/update-label.dto';
import { ErrorResult, NotFoundResult, BadRequestResult, InternalServerErrorResult } from '../common/error-manager/errors';
import { ErrorCode } from '../common/error-manager/error-codes';
import { User } from '../user/user.entity';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { UpdateUserDto } from '../user/dto/update-user.dto';
import { UserService } from '../user/user.service';

@Injectable()
export class LabelService {
    constructor(
        //@InjectRepository(Label)  
        private readonly httpService: HttpService,
        private readonly LabelRepository: LabelRepository,
        private readonly userService: UserService,
    ) { }

    async create(LabelDto: CreateLabelDto): Promise<Label> {
        return new Promise((resolve: (result: Label) => void, reject: (reason: ErrorResult) => void): void => {

            this.LabelRepository.createLabel(LabelDto).then((Label: Label) => {
                resolve(Label);
                /*this.userService.create(Label.id).then((user: User) => {
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

    update(id: string, LabelDto: UpdateLabelDto): Promise<Label> {
        return new Promise((resolve: (result: Label) => void, reject: (reason: ErrorResult) => void): void => {
            this.LabelRepository.getLabel(id).then((Label: Label) => {
                if (!Label) {
                    reject(new NotFoundResult(ErrorCode.UnknownEntity, 'There is no Label with the specified ID!'));
                    return;
                }
                this.LabelRepository.updateLabel(id, LabelDto).then((Label: Label) => {
                    resolve(Label);
                }).catch((error) => {
                    reject(new InternalServerErrorResult(ErrorCode.GeneralError, error));
                });
            }).catch((error) => {
                reject(new InternalServerErrorResult(ErrorCode.GeneralError, error));
            });
        });
    }

    async getLabel(id: string): Promise<Label> {
        return new Promise((resolve: (result: Label) => void, reject: (reason: ErrorResult) => void): void => {
            this.LabelRepository.getLabel(id).then((Label: Label) => {
                if (!Label) {
                    reject(new NotFoundResult(ErrorCode.UnknownEntity, 'There is no Label with the specified ID!'));
                    return;
                }
                resolve(Label);
            }).catch((error) => {
                reject(new InternalServerErrorResult(ErrorCode.GeneralError, error));
            });
        });
    }
  
    delete(id: string): Promise<Label> {
        return new Promise((resolve: (result: Label) => void, reject: (reason: ErrorResult) => void): void => {
            this.LabelRepository.getLabel(id).then((Label: Label) => {
                if (!Label) {
                    reject(new NotFoundResult(ErrorCode.UnknownEntity, 'There is no Label with the specified ID!'));
                    return;
                }
                this.LabelRepository.remove(Label).then((Label: Label) => {
                    if (!Label) {
                        reject(new BadRequestResult(ErrorCode.UnknownError, 'It can not be eliminated!'));
                        return;
                    }
                    resolve(Label);
                });
            }).catch((error) => {
                reject(new InternalServerErrorResult(ErrorCode.GeneralError, error));
            });
        });
    }
}
