import { Provider } from '@nestjs/common';
import { Repository } from 'typeorm';
import { HashingService } from '../../shared/hashing/hashing.service';
import { ConfigService } from '@nestjs/config';
import { Client } from '../models/client.model';
export declare const configService: ConfigService<Record<string, unknown>, false>;
export declare function provideClientRepository(): Provider[];
export declare class ClientRepoDependenciesProvider {
    typeOrmRepository: Repository<Client>;
    hashingService: HashingService;
    constructor(typeOrmRepository: Repository<Client>, hashingService: HashingService);
}
