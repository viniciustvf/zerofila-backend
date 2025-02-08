import { UpdateResult } from 'typeorm';
import { Fila } from './models/fila.model';
import { FilaTypeOrmRepository } from './repositories/implementations/fila.typeorm.repository';
import { FilaUpdateDto } from './dto/fila-update.dto';
import { EmpresaTypeOrmRepository } from '@/empresa/repositories/implementations/empresa.typeorm.repository';
import { FilaDto } from './dto/fila.dto';
import { FilaGateway } from './fila.gateway';
import { Client } from '@/client/models/client.model';
import { ClientTypeOrmRepository } from '@/client/repositories/implementations/client.typeorm.repository';
export declare class FilaService {
    private readonly filaRepository;
    private readonly clientRepository;
    private readonly empresaRepository;
    private readonly filaGateway;
    private twilioClient;
    private readonly messagingServiceSid;
    private notifiedClients;
    constructor(filaRepository: FilaTypeOrmRepository, clientRepository: ClientTypeOrmRepository, empresaRepository: EmpresaTypeOrmRepository, filaGateway: FilaGateway);
    findAll(empresaId?: string): Promise<Fila[]>;
    findById(filaId: string): Promise<Fila>;
    findByIdWithRelations(filaId: string): Promise<Fila>;
    createFila(filaDto: FilaDto): Promise<Fila>;
    validateHash(hash: string): Promise<boolean>;
    generateAndUpdateHash(): Promise<void>;
    checkQueueAndNotify(): Promise<void>;
    private sendSms;
    updateFila(id: string, filaUpdateDto: FilaUpdateDto): Promise<UpdateResult>;
    deleteFila(id: string): Promise<void>;
    findClientInQueue(telefone: string, filaId: string): Promise<Client | null>;
    getEstimatedWaitTime(filaId: string): Promise<{
        estimatedTime: number;
    }>;
}
