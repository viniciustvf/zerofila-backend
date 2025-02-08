"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const client_service_1 = require("./client.service");
const client_update_dto_1 = require("./dto/client-update.dto");
const client_dto_1 = require("./dto/client.dto");
const swagger_1 = require("@nestjs/swagger");
const auth_guard_decorator_1 = require("../iam/login/decorators/auth-guard.decorator");
const auth_type_enum_1 = require("../iam/login/enums/auth-type.enum");
let ClientController = class ClientController {
    constructor(clientService) {
        this.clientService = clientService;
    }
    async findAllClient() {
        return this.clientService.findAll();
    }
    async findOneClient(clientId) {
        return this.clientService.findById(clientId);
    }
    async createClient(clientDto) {
        try {
            console.log(clientDto);
            await this.clientService.createClient(clientDto);
            return {
                message: 'Client created successfully!',
                status: common_1.HttpStatus.CREATED,
            };
        }
        catch (err) {
            throw new common_1.BadRequestException(err, 'Error: Client not created!');
        }
    }
    async updateClient(clientId, clientUpdateDto) {
        try {
            await this.clientService.updateClient(clientId, clientUpdateDto);
            return {
                message: 'Client Updated successfully!',
                status: common_1.HttpStatus.OK,
            };
        }
        catch (err) {
            throw new common_1.BadRequestException(err, 'Error: Client not updated!');
        }
    }
    async deleteClient(clientId) {
        await this.clientService.deleteClient(clientId);
    }
    async findClientsByEmpresaAndDate(empresaId, startDate, endDate) {
        try {
            const formattedStartDate = this.convertToMySQLFormat(startDate, true);
            const formattedEndDate = this.convertToMySQLFormat(endDate, false);
            console.log(`🔎 Buscando clientes da empresa ${empresaId} entre ${formattedStartDate} e ${formattedEndDate}`);
            const clientes = await this.clientService.findClientsByEmpresaAndDate(empresaId, formattedStartDate, formattedEndDate);
            console.log('✅ Clientes encontrados:', clientes);
            return clientes;
        }
        catch (err) {
            console.error('❌ Erro ao buscar clientes:', err);
            throw new common_1.BadRequestException('Erro ao buscar clientes!', err);
        }
    }
    convertToMySQLFormat(dateStr, startOfDay) {
        const [day, month, year] = dateStr.split('-').map(Number);
        const date = new Date(year, month - 1, day);
        const hours = startOfDay ? '00' : '23';
        const minutes = startOfDay ? '00' : '59';
        const seconds = startOfDay ? '00' : '59';
        return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')} ${hours}:${minutes}:${seconds}`;
    }
};
exports.ClientController = ClientController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Get all Client',
    }),
    openapi.ApiResponse({ status: 200, type: [require("./models/client.model").Client] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ClientController.prototype, "findAllClient", null);
__decorate([
    (0, common_1.Get)('/:clientId'),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Get a Client by id',
    }),
    (0, swagger_1.ApiNotFoundResponse)({ status: 400, description: 'Client not found' }),
    openapi.ApiResponse({ status: 200, type: require("./models/client.model").Client }),
    __param(0, (0, common_1.Param)('clientId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ClientController.prototype, "findOneClient", null);
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiCreatedResponse)({
        status: 201,
        description: 'Client created successfully',
    }),
    (0, swagger_1.ApiBadRequestResponse)({ status: 400, description: 'Invalid data' }),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [client_dto_1.ClientDto]),
    __metadata("design:returntype", Promise)
], ClientController.prototype, "createClient", null);
__decorate([
    (0, common_1.Put)('/:clientId'),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Update a Client by id',
    }),
    (0, swagger_1.ApiBadRequestResponse)({ status: 400, description: 'Client not updated' }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)('clientId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, client_update_dto_1.ClientUpdateDto]),
    __metadata("design:returntype", Promise)
], ClientController.prototype, "updateClient", null);
__decorate([
    (0, common_1.Delete)('/:clientId'),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Delete a Client by id',
    }),
    (0, swagger_1.ApiNoContentResponse)({ status: 404, description: 'Client not deleted' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('clientId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ClientController.prototype, "deleteClient", null);
__decorate([
    (0, common_1.Get)('/empresa/:empresaId/clientes/:startDate/:endDate'),
    openapi.ApiResponse({ status: 200, type: [require("./models/client.model").Client] }),
    __param(0, (0, common_1.Param)('empresaId')),
    __param(1, (0, common_1.Param)('startDate')),
    __param(2, (0, common_1.Param)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], ClientController.prototype, "findClientsByEmpresaAndDate", null);
exports.ClientController = ClientController = __decorate([
    (0, swagger_1.ApiTags)('client'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, auth_guard_decorator_1.AuthGuard)(auth_type_enum_1.AuthType.None),
    (0, common_1.Controller)('client'),
    __metadata("design:paramtypes", [client_service_1.ClientService])
], ClientController);
//# sourceMappingURL=client.controller.js.map