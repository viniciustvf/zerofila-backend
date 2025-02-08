import { Repository, UpdateResult } from 'typeorm';
import { HashingService } from '../../../shared/hashing/hashing.service';
import { ClientRepository } from '../client.repository.interface';
import { Client } from '@/client/models/client.model';
export declare class ClientTypeOrmRepository implements ClientRepository {
    private readonly clientRepository;
    private readonly hashingService;
    constructor(clientRepository: Repository<Client>, hashingService: HashingService);
    findClientsByEmpresaAndDate(empresaId: string, startDate: string, endDate: string): Promise<Client[]>;
    findByLastFilaId(lastFilaId: string): Promise<Client[]>;
    findAll(): Promise<Client[]>;
    findById(clientId: string): Promise<Client | null>;
    findByFilaId(filaId: number): Promise<Client[]>;
    create(client: Client): Promise<Client>;
    updateClient(id: string, client: Client): Promise<UpdateResult>;
    deleteClient(Client: any): Promise<void>;
}
