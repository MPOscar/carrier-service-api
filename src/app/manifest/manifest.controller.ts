import {
    Controller,
    Put,
    Get,
    Delete,
    UsePipes,
    Body,
    Param,
    UseGuards,
    Post,
    Query,
} from '@nestjs/common';
import { ErrorManager } from '../common/error-manager/error-manager';
import { ErrorResult } from '../common/error-manager/errors';
import { ValidationPipe } from '../common/pipes/validation.pipe';
//
import { Manifest } from './manifest.entity';
import { ManifestService } from './manifest.service';
import { IManifest } from './interfaces/manifest.interface';
import { ManifestDto } from './dto/create-manifest.dto';
import { JwtAuthGuard } from '../common/auth/guards/auth.guard';

@Controller('manifest')
@UseGuards(JwtAuthGuard)
export class ManifestController {
    constructor(private readonly manifestService: ManifestService) {}

    // @Post()
    // async createManifest(@GetUser() user: User, @Query() query: any) {
    //     let withdrawal: Withdrawal = await this.withdrawalService.getWithdrawal(
    //         query.retiroId,
    //     );

    //     return this.withdrawalService
    //         .create(order, user, createWithdrawalDto)
    //         .then((withdrawal: Withdrawal) => {
    //             return this.getWithdrawal(withdrawal);
    //         })
    //         .catch((error: ErrorResult) => {
    //             return ErrorManager.manageErrorResult(error);
    //         });

    // try {
    //     const resp: AdmissionResponseDto = await this.soapService.processAdmission(
    //         order,
    //         user,
    //     );

    //     const userDto = plainToClass(UpdateUserDto, user);
    //     let correlativeNumber = user.correlativeNumber + 1;

    //     let manifestDto: ManifestDto = {
    //         clientRut: '88020127381', // must be user.rut
    //         clientName: user.firstName,
    //         manifestNumber: user.idApiChile + correlativeNumber,
    //         productName: order.name,
    //         trackingReference: resp.admitirEnvioResult.CodigoEncaminamiento,
    //         packagesCount: 1,
    //         barCode:
    //             resp.admitirEnvioResult.CodigoEncaminamiento +
    //             resp.admitirEnvioResult.NumeroEnvio +
    //             '1', //TODO: Change 1 for tatola pieces
    //         expNumber: '805', // TODO: check this
    //         admissionCode: resp.admitirEnvioResult.CodigoAdmision,
    //     };

    //     userDto.correlativeNumber = correlativeNumber;
    //     await this.userService.update(user.id, userDto);

    //     const manifest = await this.manifestService.create(
    //         manifestDto,
    //         order,
    //     );
    //     return response.json({ manifest });
    // } catch (error) {
    //     throw error;
    // }
    // }

    @Put(':id')
    @UsePipes(new ValidationPipe({ skipMissingProperties: true }))
    async update(@Param('id') id: string, @Body() manifest: ManifestDto) {
        return this.manifestService
            .update(id, manifest)
            .then((manifest: Manifest) => {
                return this.getIManifest(manifest);
            })
            .catch((error: ErrorResult) => {
                return ErrorManager.manageErrorResult(error);
            });
    }

    @Get()
    async getManifests() {
        return this.manifestService
            .getManifests()
            .then((manifests: Manifest[]) => {
                return manifests.map((manifest: Manifest) => {
                    return this.getIManifest(manifest);
                });
            })
            .catch((error: ErrorResult) => {
                return ErrorManager.manageErrorResult(error);
            });
    }

    @Get(':id')
    async getManifest(@Param('id') id: string) {}

    @Delete(':id')
    delete(@Param('id') id: string) {
        return this.manifestService
            .delete(id)
            .then((manifest: Manifest) => {
                return this.getIManifest(manifest);
            })
            .catch((error: ErrorResult) => {
                return ErrorManager.manageErrorResult(error);
            });
    }

    getIManifest(manifest: Manifest): IManifest {
        return {
            id: manifest.id,
            clientRut: manifest.clientRut,
            manifestNumber: manifest.manifestNumber,
            productName: manifest.productName,
            trackingReference: manifest.trackingReference,
            packagesCount: manifest.packagesCount,
            barCode: manifest.barCode,
            expNumber: manifest.expNumber,
            admissionCode: manifest.admissionCode,
            createdAt: manifest.createdAt,
            updatedAt: manifest.updatedAt,
        };
    }
}
