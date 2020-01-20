import { Injectable, HttpService } from '@nestjs/common';
import { map } from 'rxjs/operators';

import { InjectRepository } from '@nestjs/typeorm';

import { Label } from './label.entity';
import { LabelRepository } from './label.repository';
import { CreateLabelDto } from './dto/create-label.dto';
import { UpdateLabelDto } from './dto/update-label.dto';
import {
    ErrorResult,
    NotFoundResult,
    BadRequestResult,
    InternalServerErrorResult,
} from '../common/error-manager/errors';
import { ErrorCode } from '../common/error-manager/error-codes';
import { User } from '../user/user.entity';
import axios from 'axios';
import { ConfigService } from '../common/config/config.service';
import * as dataRegions from '../soap/region-comuna-sucursal.json';
import { OrderService } from '../order/order.service';

@Injectable()
export class LabelService {
    constructor(
        //@InjectRepository(Label)
        private readonly httpService: HttpService,
        private readonly LabelRepository: LabelRepository,
        private readonly configService: ConfigService,
        private readonly orderService: OrderService,
    ) {}

    async create(orderId: string, user: User): Promise<any> {
        return new Promise(
            (
                resolve: (result) => void,
                reject: (reason: ErrorResult) => void,
            ): void => {
                this.orderService
                    .getOrder(orderId)
                    .then(async order => {
                        try {
                            let comunaDestino = dataRegions
                                .find(reg => reg.rgi == order.receiverCityCode)
                                .comunas.find(
                                    comuna =>
                                        comuna.name.includes(
                                            order.receiverCity.toUpperCase(),
                                        ) ||
                                        order.receiverCity
                                            .toUpperCase()
                                            .includes(comuna.name),
                                ).name;

                            let data = {
                                Usuario: user.userApiChile,
                                Contrasena: user.passwordApiChile,
                                AdmisionTo: {
                                    CodigoAdmision:
                                        order.admission.codigoAdmision,
                                    ClienteRemitente: user.idApiChile,
                                    CentroRemitente: '',
                                    NombreRemitente: user.shopUrl,
                                    DireccionRemitente: user.address,
                                    PaisRemitente: '056',
                                    CodigoPostalRemitente: '',
                                    ComunaRemitente: user.comuna,
                                    RutRemitente: user.rut,
                                    PersonaContactoRemitente:
                                        user.firstName + ' ' + user.lastName,
                                    TelefonoContactoRemitente: user.phone,
                                    ClienteDestinatario: '',
                                    CentroDestinatario: '',
                                    NombreDestinatario: order.receiverName,
                                    DireccionDestinatario:
                                        order.receiverAddress,
                                    PaisDestinatario: '056',
                                    CodigoPostalDestinatario: '',
                                    ComunaDestinatario: comunaDestino,
                                    RutDestinatario: '',
                                    PersonaContactoDestinatario:
                                        order.receiverContactName,
                                    TelefonoContactoDestinatario:
                                        order.receiverContactPhone,
                                    CodigoServicio: order.serviceCode,
                                    NumeroTotalPiezas: 1,
                                    Kilos: 1,
                                    Volumen: 0,
                                    NumeroReferencia: order.number,
                                    ImporteReembolso: 0,
                                    ImporteValorDeclarado: 0,
                                    TipoPortes: 'P',
                                    Observaciones: '',
                                    Observaciones2: '',
                                    EmailDestino: '',
                                    TipoMercancia: '',
                                    DevolucionConforme: 'N',
                                    NumeroDocumentos: 0,
                                    PagoSeguro: 'N',
                                    FormatoEtiqueta: user.labelFormat
                                        ? user.labelFormat
                                        : 'pdf',
                                },
                            };

                            axios.interceptors.request.use(req => {
                                return req;
                            });

                            const url = this.configService.get('LABEL_URL');

                            axios
                                .post(url, data, {
                                    responseType: 'stream',
                                    headers: {
                                        'Content-Type': 'application/json',
                                    },
                                })
                                .then(response => {
                                    resolve(response.data);
                                })
                                .catch(error => {
                                    reject(error);
                                });
                        } catch (error) {
                            reject(error);
                        }
                    })
                    .catch(error => {
                        reject(error);
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

    update(id: string, LabelDto: UpdateLabelDto): Promise<Label> {
        return new Promise(
            (
                resolve: (result: Label) => void,
                reject: (reason: ErrorResult) => void,
            ): void => {
                this.LabelRepository.getLabel(id)
                    .then((Label: Label) => {
                        if (!Label) {
                            reject(
                                new NotFoundResult(
                                    ErrorCode.UnknownEntity,
                                    'There is no Label with the specified ID!',
                                ),
                            );
                            return;
                        }
                        this.LabelRepository.updateLabel(id, LabelDto)
                            .then((Label: Label) => {
                                resolve(Label);
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

    async getLabel(id: string): Promise<Label> {
        return new Promise(
            (
                resolve: (result: Label) => void,
                reject: (reason: ErrorResult) => void,
            ): void => {
                this.LabelRepository.getLabel(id)
                    .then((Label: Label) => {
                        if (!Label) {
                            reject(
                                new NotFoundResult(
                                    ErrorCode.UnknownEntity,
                                    'There is no Label with the specified ID!',
                                ),
                            );
                            return;
                        }
                        resolve(Label);
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

    delete(id: string): Promise<Label> {
        return new Promise(
            (
                resolve: (result: Label) => void,
                reject: (reason: ErrorResult) => void,
            ): void => {
                this.LabelRepository.getLabel(id)
                    .then((Label: Label) => {
                        if (!Label) {
                            reject(
                                new NotFoundResult(
                                    ErrorCode.UnknownEntity,
                                    'There is no Label with the specified ID!',
                                ),
                            );
                            return;
                        }
                        this.LabelRepository.remove(Label).then(
                            (Label: Label) => {
                                if (!Label) {
                                    reject(
                                        new BadRequestResult(
                                            ErrorCode.UnknownError,
                                            'It can not be eliminated!',
                                        ),
                                    );
                                    return;
                                }
                                resolve(Label);
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
