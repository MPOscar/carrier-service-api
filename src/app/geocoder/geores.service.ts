import { Injectable } from '@nestjs/common';
import { ConfigService } from '../common/config/config.service';
import { GeoRes } from './geores.dto';
import * as NodeGeocoder from 'node-geocoder';

@Injectable()
export class GeoResService {
    constructor(private readonly configService: ConfigService) {}

    getGeocodeAddress = (
        address: string,
        countryCode: string,
    ): Promise<GeoRes> => {
        return new Promise(
            (
                resolve: (result: GeoRes) => void,
                reject: (reason) => void,
            ): void => {
                const options = {
                    provider: 'mapquest',
                    httpAdapter: 'http',
                    apiKey: this.configService.get('MAPQUEST_API_KEY'),
                    formatter: null,
                };

                var geocoder = NodeGeocoder(options);

                geocoder.geocode(
                    { address: address, country: countryCode },
                    function(err, res: GeoRes[]) {
                        if (err) reject(err);

                        resolve(res[0]);
                    },
                );
            },
        );
    };
}
