import { FilaService } from './fila.service';
import { FilaUpdateDto } from './dto/fila-update.dto';
import { FilaDto } from './dto/fila.dto';
import { Fila } from './models/fila.model';
export declare class FilaController {
    private readonly filaService;
    constructor(filaService: FilaService);
    findAllFila(empresaId?: string): Promise<Fila[]>;
    findOneFila(filaId: string): Promise<Fila>;
    findByIdWithRelations(filaId: string): Promise<Fila>;
    createFila(filaDto: FilaDto): Promise<{
        message: string;
        status: number;
    }>;
    updateFila(filaId: string, filaUpdateDto: FilaUpdateDto): Promise<any>;
    deleteFila(filaId: string): Promise<void>;
    validateHash(body: {
        hash: string;
    }): Promise<{
        isValid: boolean;
        message: string;
    }>;
    checkClientInQueue(telefone: string, filaId: string): Promise<{
        exists: boolean;
        client: import("../client/models/client.model").Client;
    }>;
    getEstimatedTime(filaId: string): Promise<{
        estimatedTime: number;
    }>;
}
