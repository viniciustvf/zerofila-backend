import {
    Controller,
    Put,
    Get,
    Post,
    Body,
    Param,
    HttpStatus,
    Delete,
    BadRequestException,
    Query,
  } from '@nestjs/common';
  import { FilaService } from './fila.service';
  import { FilaUpdateDto } from './dto/fila-update.dto';
  import { FilaDto } from './dto/fila.dto';
  import {
    ApiBadRequestResponse,
    ApiBearerAuth,
    ApiCreatedResponse,
    ApiNoContentResponse,
    ApiNotFoundResponse,
    ApiResponse,
    ApiTags,
  } from '@nestjs/swagger';
  import { AuthGuard, Public } from '../iam/login/decorators/auth-guard.decorator';
  import { AuthType } from '../iam/login/enums/auth-type.enum';
  import { Fila } from './models/fila.model';
  
  @ApiTags('fila')
@ApiBearerAuth()
@AuthGuard(AuthType.Bearer)
  @Controller('fila')
  export class FilaController {
    constructor(private readonly filaService: FilaService) {}
  
    @Get()
    @ApiResponse({
      status: 200,
      description: 'Get all fila from a specific company',
    })
    public async findAllFila(
      @Query('empresaId') empresaId?: string,
    ): Promise<Fila[]> {
      return this.filaService.findAll(empresaId);
    }
  
    @Get('/:filaId')
    @ApiResponse({
      status: 200,
      description: 'Get a fila by id',
    })
    @ApiNotFoundResponse({ status: 400, description: 'fila not found' })
    public async findOneFila(
      @Param('filaId') filaId: string,
    ): Promise<Fila> {
      return this.filaService.findById(filaId);
    }

    @Post('/generate-hash')
    @ApiResponse({
      status: 200,
      description: 'Trigger hash generation and update',
    })
    @Public()
    public async triggerHashUpdate(): Promise<{ message: string }> {
      try {
        await this.filaService.generateAndUpdateHash();
        return { message: 'Hash generated and updated successfully!' };
      } catch (error) {
        console.error('Error triggering hash update:', error);
        throw new BadRequestException('Failed to generate and update hash');
      }
    }

    @Get('findByIdWithRelations/:filaId')
    @Public()
    @ApiResponse({
      status: 200,
      description: 'Get a fila by id',
    })
    @ApiNotFoundResponse({ status: 400, description: 'fila not found' })
    public async findByIdWithRelations(
      @Param('filaId') filaId: string,
    ): Promise<Fila> {
      return this.filaService.findByIdWithRelations(filaId);
    }
  
    @Post()
    @ApiCreatedResponse({
      status: 201,
      description: 'Fila created successfully',
    })
    @ApiBadRequestResponse({ status: 400, description: 'Invalid data' })
    public async createFila(
      @Body() filaDto: FilaDto,
    ): Promise<{ message: string; status: number }> {
      try {
        console.log(filaDto);
        await this.filaService.createFila(filaDto);
        return {
          message: 'Fila created successfully!',
          status: HttpStatus.CREATED,
        };
      } catch (err) {
        throw new BadRequestException(err, 'Error: Fila not created!');
      }
    }
  
    @Put('/:filaId')
    @ApiResponse({
      status: 200,
      description: 'Update a fila by id',
    })
    @ApiBadRequestResponse({ status: 400, description: 'fila not updated' })
    public async updateFila(
      @Param('filaId') filaId: string,
      @Body() filaUpdateDto: FilaUpdateDto,
    ): Promise<any> {
      try {
        await this.filaService.updateFila(filaId, filaUpdateDto);
  
        return {
          message: 'fila Updated successfully!',
          status: HttpStatus.OK,
        };
      } catch (err) {
        throw new BadRequestException(err, 'Error: fila not updated!');
      }
    }
  
    @Delete('/:filaId')
    @ApiResponse({
      status: 200,
      description: 'Delete a fila by id',
    })
    @ApiNoContentResponse({ status: 404, description: 'fila not deleted' })
    public async deleteFila(@Param('filaId') filaId: string): Promise<void> {
      await this.filaService.deleteFila(filaId);
    }

    @Post('/validate-hash')
    @Public()
    @ApiResponse({
      status: 200,
      description: 'Validate hash successfully',
    })
    @ApiBadRequestResponse({ status: 400, description: 'Invalid hash or parameters' })
    public async validateHash(
      @Body() body: { hash: string },
    ): Promise<{ isValid: boolean; message: string }> {
      try {
        const { hash } = body;
    
        if (!hash) {
          throw new BadRequestException('Hash are required');
        }
    
        const isValid = await this.filaService.validateHash(hash);
    
        if (isValid) {
          return { isValid: true, message: 'Hash is valid' };
        } else {
          return { isValid: false, message: 'Hash is invalid or expired' };
        }
      } catch (err) {
        throw new BadRequestException(err, 'Error validating hash!');
      }
    }

    @Get('check-client')
    @Public()
    async checkClientInQueue(
      @Query('telefone') telefone: string,
      @Query('filaId') filaId: string
    ) {
      try {
        console.log('📡 Requisição recebida:', { telefone, filaId });
    
        // Verificar o tipo real de filaId
        console.log('📊 Tipo de filaId recebido:', typeof filaId, ' | Valor:', filaId);
    
        const parsedFilaId = parseInt(filaId, 10); // 🛠️ Converte para número inteiro
        console.log('🔍 Após conversão: parsedFilaId =', parsedFilaId);
    
        if (!telefone || Number.isNaN(parsedFilaId) || parsedFilaId <= 0) {
          console.error('❌ Erro: ID da fila inválido!ASASCCCCCCCC', { telefone, filaId, parsedFilaId });
          throw new BadRequestException('ID da fila inválido. AFSGSDGDS');
        }
    
        console.log(`✅ Parâmetros validados: telefone=${telefone}, filaId=${parsedFilaId}`);
    
        const client = await this.filaService.findClientInQueue(telefone, parsedFilaId);
        
        if (!client) {
          console.warn(`⚠️ Nenhum cliente encontrado para filaId=${parsedFilaId} e telefone=${telefone}`);
        }
    
        console.log('✅ Resposta da API:', { exists: !!client, client });
    
        return { exists: !!client, client };
      } catch (error) {
        console.error('❌ Erro no checkClientInQueue:', error);
        throw error;
      }
    }          

    @Get('/check-queue')
    @Public()
    @ApiResponse({
      status: 200,
      description: 'Verifica a fila e notifica os clientes',
    })
    public async checkQueueAndNotify(): Promise<{ message: string }> {
      try {
        await this.filaService.checkQueueAndNotify();
        return { message: 'Fila verificada e clientes notificados!' };
      } catch (error) {
        console.error('Erro ao verificar a fila:', error);
        throw new BadRequestException('Erro ao verificar a fila');
      }
    }

    @Get(':filaId/estimated-time')
    @Public()
    async getEstimatedTime(@Param('filaId') filaId: string) {
      return this.filaService.getEstimatedWaitTime(filaId);
    }
  }
  