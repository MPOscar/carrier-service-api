import {
    Controller,
    Post,
    Put,
    Get,
    Delete,
    UsePipes,
    Body,
    Param,
    Query,
    Response,
    HttpService,
} from '@nestjs/common';
import { ErrorManager } from '../common/error-manager/error-manager';
import { ErrorResult } from '../common/error-manager/errors';
import { ValidationPipe } from '../common/pipes/validation.pipe';
//
import { Manifest } from './manifest.entity';
import { ManifestService } from './manifest.service';
import { UpdateManifestDto } from './dto/update-manifest.dto';
import { IManifest } from './interfaces/manifest.interface';
import * as express from 'express';
//

import { ConfigService } from '../common/config/config.service';
import { ManifestDto } from './dto/create-manifest.dto';
const configService = new ConfigService();
const request = require('request-promise');
const nonce = require('nonce')();

const apiKey = configService.get('SHOPIFY_API_KEY');
const apiSecret = configService.get('SHOPIFY_API_SECRET_KEY');
const scopes = 'write_shipping, read_order';
const forwardingAddress = configService.get('FORWARDING_ADDRESS');

@Controller('manifest')
//@UseGuards(AuthGuard(), RolesGuard)
export class ManifestController {
    constructor(private readonly manifestService: ManifestService) {}

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
    async getManifest(
        @Param('id') id: string,
        @Response() response: express.Response,
    ) {}

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
