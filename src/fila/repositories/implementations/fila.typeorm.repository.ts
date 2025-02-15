import { Repository, UpdateResult } from 'typeorm';
import { HashingService } from '../../../shared/hashing/hashing.service';
import { FilaRepository } from '../fila.repository.interface';
import { Fila } from '../../../fila/models/fila.model';
import { BadRequestException } from '@nestjs/common';

export class FilaTypeOrmRepository implements FilaRepository {
  constructor(
    private readonly filaRepository: Repository<Fila>,
    private readonly hashingService: HashingService,
  ) {}

  public async findAll() {
    return await this.filaRepository.find();
  }

  public async findById(filaId: any): Promise<Fila | null> {
    console.log('🔎 ID recebido:', filaId, '| Tipo:', typeof filaId);
  
    // 🛠️ Extrai números de qualquer string, remove caracteres inválidos
    const parsedId = parseInt(String(filaId).replace(/\D/g, ''), 10);
  
    // 🛠️ Se o número continuar inválido ou for <= 0, definir um valor seguro (ex: `1`)
    if (Number.isNaN(parsedId) || parsedId <= 0) {
      console.warn('⚠️ ID da fila inválido, convertendo para um padrão válido (1).', { filaId, parsedId });
      return await this.filaRepository.findOneBy({ id: 1 });
    }
  
    console.log('✅ Após conversão, ID final:', parsedId);
  
    return await this.filaRepository.findOneBy({ id: parsedId });
  }  

  public async findByIdWithRelations(filaId: string | number): Promise<Fila | null> {
    console.log('📡 findByIdWithRelations chamado com filaId:', filaId, '| Tipo:', typeof filaId);
  
    const parsedFilaId = parseInt(filaId as string, 10); 
  
    if (Number.isNaN(parsedFilaId) || parsedFilaId <= 0) {
      console.error('❌ Erro: ID da fila inválido!', { filaId, parsedFilaId });
      throw new BadRequestException('ID da fila deve ser um número válido.');
    }
  
    console.log('🔍 Após conversão: parsedFilaId =', parsedFilaId);
  
    return await this.filaRepository
      .createQueryBuilder('fila')
      .leftJoinAndSelect('fila.clients', 'client')
      .leftJoinAndSelect('fila.calledClient', 'calledClient')
      .leftJoinAndSelect('fila.empresa', 'empresa')
      .where('fila.id = :filaId', { filaId: parsedFilaId })
      .getOne();
  }  

  public async findClientCalledByFilaId(filaId: string): Promise<Fila | null> {
    return await this.filaRepository
      .createQueryBuilder('fila')
      .leftJoinAndSelect('fila.calledClient', 'calledClient')
      .where('fila.id = :filaId', { filaId })
      .getOne();
  }

  public async findAllByEmpresaId(empresaId: number): Promise<Fila[]> {
    const filas = await this.filaRepository.find({
      where: { empresa: { id: empresaId } },
      relations: ['empresa', 'clients', 'calledClient'],
    });

    return filas.map((fila) => ({
      ...fila,
      qtdClients: fila.clients ? fila.clients.length : 0,
    }));
  }

  public async create(fila: Fila): Promise<Fila> {
    return await this.filaRepository.save(fila);
  }

  public async updateFila(
    id: string,
    fila: Fila,
  ): Promise<UpdateResult> {
    return await this.filaRepository.update(
      {
        id: +id,
      },
      { ...fila },
    );
  }

  public async deleteFila(Fila: any): Promise<void> {
    await this.filaRepository.remove(Fila);
  }
}
