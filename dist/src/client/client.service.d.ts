import { UpdateResult } from 'typeorm';
import { Client } from './models/client.model';
import { ClientTypeOrmRepository } from './repositories/implementations/client.typeorm.repository';
import { ClientUpdateDto } from './dto/client-update.dto';
import { ClientDto } from './dto/client.dto';
import { FilaTypeOrmRepository } from '@/fila/repositories/implementations/fila.typeorm.repository';
export declare class ClientService {
    private readonly clientRepository;
    private readonly filaRepository;
    constructor(clientRepository: ClientTypeOrmRepository, filaRepository: FilaTypeOrmRepository);
    findAll(): Promise<Client[]>;
    findById(clientId: string): Promise<Client>;
    createClient(clientDto: ClientDto): Promise<Client>;
    updateClient(id: string, clientUpdateDto: ClientUpdateDto): Promise<UpdateResult>;
    deleteClient(id: string): Promise<void>;
    findClientsByEmpresaAndDate(empresaId: string, startDate: string, endDate: string): Promise<Client[]>;
}
