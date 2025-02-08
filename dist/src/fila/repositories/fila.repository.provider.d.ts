import { Provider } from '@nestjs/common';
import { Repository } from 'typeorm';
import { HashingService } from '../../shared/hashing/hashing.service';
import { ConfigService } from '@nestjs/config';
import { Fila } from '../models/fila.model';
export declare const configService: ConfigService<Record<string, unknown>, false>;
export declare function provideFilaRepository(): Provider[];
export declare class FilaRepoDependenciesProvider {
    typeOrmRepository: Repository<Fila>;
    hashingService: HashingService;
    constructor(typeOrmRepository: Repository<Fila>, hashingService: HashingService);
}
