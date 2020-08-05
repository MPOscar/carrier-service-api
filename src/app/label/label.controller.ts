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
import { LabelService } from './label.service';
import * as express from 'express';
import { JwtAuthGuard } from '../common/auth/guards/auth.guard';
import { IncomingMessage } from 'http';

@Controller('label')
@UseGuards(JwtAuthGuard)
export class LabelController {
    constructor(private readonly labelService: LabelService) { }

    @Post()
    async create(
        @GetUser() user: User,
        @Query() query: any,
        @Response() response: express.Response,
    ) {
        return this.labelService
            .create(query.orderId, user)
            .then((label: IncomingMessage) => {
                let fileName = '';
                const disposition = label.headers['content-disposition'].toString();
                if (disposition && disposition.indexOf('attachment') !== -1) {
                    const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
                    const matches = filenameRegex.exec(disposition);
                    if (matches != null && matches[1]) {
                        fileName = matches[1].replace(/['"]/g, '');
                    }
                }

                const labelFormat =
                    user.labelFormat === 'pdf' || user.labelFormat === 'pdfs'
                        ? 'pdf'
                        : user.labelFormat;
                response.setHeader('Content-Type', 'application/' + labelFormat);
                response.setHeader(
                    'Content-Disposition',
                    'attachment; filename=' + fileName,
                );

                this.labelService.updateAdmissionShippingNumber(query.orderId, fileName.split('.')[0])
                    .then(() => label.pipe(response))
                    .catch((error: ErrorResult) => ErrorManager.manageErrorResult(error));
            })
            .catch((error: ErrorResult) => {
                return ErrorManager.manageErrorResult(error);
            });
    }
}
