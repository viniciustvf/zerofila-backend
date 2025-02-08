"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FilaModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const mailer_module_1 = require("../shared/mailer/mailer.module");
const bcrypt_service_1 = require("../shared/hashing/bcrypt.service");
const hashing_service_1 = require("../shared/hashing/hashing.service");
const fila_controller_1 = require("./fila.controller");
const fila_model_1 = require("./models/fila.model");
const fila_service_1 = require("./fila.service");
const fila_repository_provider_1 = require("./repositories/fila.repository.provider");
const empresa_module_1 = require("../empresa/empresa.module");
const fila_gateway_1 = require("./fila.gateway");
const client_model_1 = require("../client/models/client.model");
const client_module_1 = require("../client/client.module");
const schedule_1 = require("@nestjs/schedule");
let FilaModule = class FilaModule {
};
exports.FilaModule = FilaModule;
exports.FilaModule = FilaModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([fila_model_1.Fila, client_model_1.Client]), mailer_module_1.MailerModule, empresa_module_1.EmpresaModule, (0, common_1.forwardRef)(() => client_module_1.ClientModule), schedule_1.ScheduleModule.forRoot()],
        controllers: [fila_controller_1.FilaController],
        providers: [
            {
                provide: hashing_service_1.HashingService,
                useClass: bcrypt_service_1.BcryptService,
            },
            fila_service_1.FilaService,
            ...(0, fila_repository_provider_1.provideFilaRepository)(),
            fila_gateway_1.FilaGateway,
        ],
        exports: [...(0, fila_repository_provider_1.provideFilaRepository)()],
    })
], FilaModule);
//# sourceMappingURL=fila.module.js.map