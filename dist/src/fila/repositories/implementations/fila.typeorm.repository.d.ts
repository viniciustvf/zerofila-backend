import { Repository, UpdateResult } from 'typeorm';
import { HashingService } from '../../../shared/hashing/hashing.service';
import { FilaRepository } from '../fila.repository.interface';
import { Fila } from '@/fila/models/fila.model';
export declare class FilaTypeOrmRepository implements FilaRepository {
    private readonly filaRepository;
    private readonly hashingService;
    constructor(filaRepository: Repository<Fila>, hashingService: HashingService);
    findAll(): Promise<Fila[]>;
    findById(filaId: string): Promise<Fila | null>;
    findByIdWithRelations(filaId: string): Promise<Fila | null>;
    findClientCalledByFilaId(filaId: string): Promise<Fila | null>;
    findAllByEmpresaId(empresaId: number): Promise<Fila[]>;
    create(fila: Fila): Promise<Fila>;
    updateFila(id: string, fila: Fila): Promise<UpdateResult>;
    deleteFila(Fila: any): Promise<void>;
}
