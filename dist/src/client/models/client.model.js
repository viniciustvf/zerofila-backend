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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Client = void 0;
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
const fila_model_1 = require("../../fila/models/fila.model");
let Client = class Client {
};
exports.Client = Client;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Identificador único do cliente',
        example: 1,
    }),
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Client.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Nome do cliente',
        example: 'João da Silva',
    }),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Client.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Número de telefone',
        example: '48999072751',
        maxLength: 60,
    }),
    (0, typeorm_1.Column)({ length: 60, nullable: true }),
    __metadata("design:type", String)
], Client.prototype, "telefone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Fila associada ao cliente',
        type: () => fila_model_1.Fila,
    }),
    (0, typeorm_1.ManyToOne)(() => fila_model_1.Fila, { onDelete: 'CASCADE' }),
    __metadata("design:type", fila_model_1.Fila)
], Client.prototype, "fila", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Posição do cliente na fila',
        example: 3,
    }),
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Client.prototype, "position", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Client.prototype, "lastFilaId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Horário de entrada do cliente na fila',
        example: '2024-02-01T10:30:00.000Z',
    }),
    (0, typeorm_1.Column)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], Client.prototype, "entryTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Horário de saída do cliente da fila',
        example: '2024-02-01T10:45:00.000Z',
        nullable: true,
    }),
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], Client.prototype, "exitTime", void 0);
exports.Client = Client = __decorate([
    (0, typeorm_1.Entity)()
], Client);
//# sourceMappingURL=client.model.js.map