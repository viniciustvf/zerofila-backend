import { Between, Repository, UpdateResult } from 'typeorm';
import { HashingService } from '../../../shared/hashing/hashing.service';
import { ClientRepository } from '../client.repository.interface';
import { Client } from '../../../client/models/client.model';

export class ClientTypeOrmRepository implements ClientRepository {
  constructor(
    private readonly clientRepository: Repository<Client>,
    private readonly hashingService: HashingService,
  ) {}
  
  async findClientsByEmpresaAndDate(
    empresaId: string | number, 
    startDate: string | Date, 
    endDate: string | Date
  ): Promise<Client[]> {
    const empresaIdParsed = Number(empresaId);
    if (isNaN(empresaIdParsed)) {
      throw new Error(`Erro: empresaId inválido (${empresaId})`);
    }
  
    const startDateParsed = new Date(startDate);
    const endDateParsed = new Date(endDate);
  
    if (isNaN(startDateParsed.getTime()) || isNaN(endDateParsed.getTime())) {
      throw new Error(`Erro: Datas inválidas -> startDate: ${startDate}, endDate: ${endDate}`);
    }
  
    const startDateFormatted = startDateParsed.toISOString().slice(0, 19).replace('T', ' ');
    const endDateFormatted = endDateParsed.toISOString().slice(0, 19).replace('T', ' ');
  
    return this.clientRepository
      .createQueryBuilder('client')
      .innerJoin('client.fila', 'fila')
      .innerJoin('fila.empresa', 'empresa')
      .where('empresa.id = :empresaId', { empresaId: empresaIdParsed })
      .andWhere('client.entryTime BETWEEN :startDate AND :endDate', { 
        startDate: startDateFormatted, 
        endDate: endDateFormatted 
      })
      .orderBy('client.entryTime', 'ASC')
      .getMany();
  }  
  
  async findByLastFilaId(lastFilaId: string): Promise<Client[]> {
    if (!lastFilaId) {
      throw new Error('Erro: lastFilaId não pode ser nulo ou indefinido');
    }
  
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date();
    tomorrow.setHours(23, 59, 59, 999); 
    
    return await this.clientRepository.find({
      where: {
        lastFilaId: lastFilaId,
        entryTime: Between(today, tomorrow),
      },
    });
  }

  public async findAll() {
    return await this.clientRepository.find();
  }

  public async findById(clientId: string): Promise<Client | null> {
    return await this.clientRepository.findOneBy({
      id: +clientId,
    });
  }

  public async findByFilaId(filaId: number): Promise<Client[]> {
    return await this.clientRepository.find({
      where: { fila: { id: filaId } },
      relations: ['fila'],
    });
  }

  public async create(client: Client): Promise<Client> {
    return await this.clientRepository.save(client);
  }

  public async updateClient(
    id: string,
    client: Client,
  ): Promise<UpdateResult> {
    console.log(client)
    return await this.clientRepository.update(
      {
        id: +id,
      },
      { ...client },
    );
  }

  public async deleteClient(Client: any): Promise<void> {
    await this.clientRepository.remove(Client);
  }
}
