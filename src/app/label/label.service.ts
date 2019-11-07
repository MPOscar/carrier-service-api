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
import { CreateUserDto } from '../user/dto/create-user.dto';
import { UpdateUserDto } from '../user/dto/update-user.dto';
import { UserService } from '../user/user.service';
import axios from 'axios';
import { ConfigService } from '../common/config/config.service';
import { ManifestService } from '../manifest/manifest.service';
import { GeoResService } from '../geocoder/geores.service';

@Injectable()
export class LabelService {
    constructor(
        //@InjectRepository(Label)
        private readonly httpService: HttpService,
        private readonly LabelRepository: LabelRepository,
        private readonly userService: UserService,
        private readonly configService: ConfigService,
        private readonly manifestService: ManifestService,
        private readonly geoResService: GeoResService,
    ) {}

    async create(manifestId: string, user: User): Promise<any> {
        return new Promise(
            (
                resolve: (result) => void,
                reject: (reason: ErrorResult) => void,
            ): void => {
                this.manifestService
                    .getManifest(manifestId)
                    .then(async manifest => {
                        try {
                            let geoItem = await this.geoResService.getGeocodeAddress(
                                manifest.order.receiverAddress,
                                'CL',
                            );

                            let data = {
                                Usuario: this.configService.get('SOAP_USER'),
                                Contrasena: this.configService.get(
                                    'SOAP_PASSWORD',
                                ),
                                AdmisionTo: {
                                    CodigoAdmision: '89465378264', // manifest.admissionCode,
                                    ClienteRemitente: user.idApiChile,
                                    CentroRemitente: '',
                                    NombreRemitente: user.shopUrl,
                                    DireccionRemitente: user.address,
                                    PaisRemitente: '056',
                                    CodigoPostalRemitente: user.zip,
                                    ComunaRemitente: user.comuna,
                                    RutRemitente: user.rut,
                                    PersonaContactoRemitente:
                                        user.firstName + ' ' + user.lastName,
                                    TelefonoContactoRemitente: user.phone,
                                    ClienteDestinatario: '',
                                    CentroDestinatario: '',
                                    NombreDestinatario:
                                        manifest.order.receiverName,
                                    DireccionDestinatario:
                                        manifest.order.receiverAddress,
                                    PaisDestinatario: '056',
                                    CodigoPostalDestinatario: '',
                                    ComunaDestinatario: geoItem.city,
                                    RutDestinatario: '',
                                    PersonaContactoDestinatario:
                                        manifest.order.receiverContactName,
                                    TelefonoContactoDestinatario:
                                        manifest.order.receiverContactPhone,
                                    CodigoServicio: manifest.order.serviceCode,
                                    NumeroTotalPiezas: 1,
                                    Kilos: 1,
                                    Volumen: 0,
                                    NumeroReferencia:
                                        manifest.trackingReference,
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
                                    FormatoEtiqueta: 'pdf',
                                },
                            };

                            axios.interceptors.request.use(req => {
                                console.log(req);
                                return req;
                            });

                            const url =
                                'http://201.238.220.46:8082/api/ServicioAdmisionCEP/postEtiqueta';

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
                                    console.log(error.response.data);
                                    reject(error);
                                });
                        } catch (error) {
                            console.log(JSON.stringify(error));
                            reject(error);
                        }
                    })
                    .catch(error => {
                        console.log(error.response);
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
