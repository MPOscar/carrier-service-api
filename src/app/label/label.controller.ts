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
    Req,
    UseGuards,
    Res,
    Header,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { map } from 'rxjs/operators';
//
import { RolesGuard } from '../common/auth/guards/roles.guard';
import { GetUser } from '../common/decorator/user.decorator';
import { Roles } from '../common/decorator/roles.decorator';
import { ErrorManager } from '../common/error-manager/error-manager';
import { ErrorResult } from '../common/error-manager/errors';
import { ValidationPipe } from '../common/pipes/validation.pipe';
import { User } from '../user/user.entity';
//
import { Label } from './label.entity';
import { LabelService } from './label.service';
import { CreateLabelDto } from './dto/create-label.dto';
import { UpdateLabelDto } from './dto/update-label.dto';
import { ILabel } from './interfaces/label.interface';
import * as express from 'express';
//

import { ConfigService } from '../common/config/config.service';
import { UserService } from '../user/user.service';
import { Readable } from 'stream';
const configService = new ConfigService();
const request = require('request-promise');
const nonce = require('nonce')();

const apiKey = configService.get('SHOPIFY_API_KEY');
const apiSecret = configService.get('SHOPIFY_API_SECRET_KEY');
const scopes = 'write_shipping, read_order';
const forwardingAddress = configService.get('FORWARDING_ADDRESS');

@Controller('label')
// @UseGuards(AuthGuard())
export class LabelController {
    constructor(
        private readonly labelService: LabelService,
        private readonly httpService: HttpService,
        private readonly userService: UserService,
    ) {}

    @Post()
    @Header('Content-Type', 'application/pdf')
    @Header('Content-Disposition', 'attachment; filename=label.pdf')
    async create(
        // @GetUser() user: User,
        @Query() query: any,
        @Response() response: express.Response,
    ) {
        let user: User = await this.userService.getUser(query.userId);
        return this.labelService
            .create(query.manifestId, user)
            .then(label => {
                label.pipe(response);
            })
            .catch((error: ErrorResult) => {
                return ErrorManager.manageErrorResult(error);
            });
    }

    getILabel(carrier: Label): ILabel {
        return {
            id: carrier.id,
            name: carrier.name,
            phone: carrier.phone,
            email: carrier.email,
            address: carrier.address,
            city: carrier.city,
            state: carrier.state,
            zip: carrier.zip,
            language: carrier.language,
            driverAssignRadius: carrier.driverAssignRadius,
            createdAt: carrier.createdAt,
            updatedAt: carrier.updatedAt,
        };
    }
}
