import { ClientService } from './client.service';
import { ClientUpdateDto } from './dto/client-update.dto';
import { ClientDto } from './dto/client.dto';
import { Client } from './models/client.model';
export declare class ClientController {
    private readonly clientService;
    constructor(clientService: ClientService);
    findAllClient(): Promise<Client[]>;
    findOneClient(clientId: string): Promise<Client>;
    createClient(clientDto: ClientDto): Promise<{
        message: string;
        status: number;
    }>;
    updateClient(clientId: string, clientUpdateDto: ClientUpdateDto): Promise<any>;
    deleteClient(clientId: string): Promise<void>;
    findClientsByEmpresaAndDate(empresaId: string, startDate: string, endDate: string): Promise<Client[]>;
    private convertToMySQLFormat;
}
