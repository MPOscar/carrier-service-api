import {
    Controller,
    Post,
    Query,
    Response,
    UseGuards,
    Header,
} from '@nestjs/common';
import { GetUser } from '../common/decorator/user.decorator';
import { ErrorManager } from '../common/error-manager/error-manager';
import { ErrorResult } from '../common/error-manager/errors';
import { User } from '../user/user.entity';
//
import { Label } from './label.entity';
import { LabelService } from './label.service';
import { ILabel } from './interfaces/label.interface';
import * as express from 'express';
//

import { ConfigService } from '../common/config/config.service';
import { JwtAuthGuard } from '../common/auth/guards/auth.guard';

@Controller('label')
@UseGuards(JwtAuthGuard)
export class LabelController {
    constructor(private readonly labelService: LabelService) {}

    @Post()
    @Header('Content-Type', 'application/pdf')
    @Header('Content-Disposition', 'attachment; filename=label.pdf')
    async create(
        @GetUser() user: User,
        @Query() query: any,
        @Response() response: express.Response,
    ) {
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
