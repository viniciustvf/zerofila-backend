"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const mailer_module_1 = require("../shared/mailer/mailer.module");
const bcrypt_service_1 = require("../shared/hashing/bcrypt.service");
const hashing_service_1 = require("../shared/hashing/hashing.service");
const client_controller_1 = require("./client.controller");
const client_model_1 = require("./models/client.model");
const client_service_1 = require("./client.service");
const client_repository_provider_1 = require("./repositories/client.repository.provider");
const fila_module_1 = require("../fila/fila.module");
const empresa_module_1 = require("../empresa/empresa.module");
let ClientModule = class ClientModule {
};
exports.ClientModule = ClientModule;
exports.ClientModule = ClientModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([client_model_1.Client]), mailer_module_1.MailerModule, (0, common_1.forwardRef)(() => fila_module_1.FilaModule), empresa_module_1.EmpresaModule],
        controllers: [client_controller_1.ClientController],
        providers: [
            {
                provide: hashing_service_1.HashingService,
                useClass: bcrypt_service_1.BcryptService,
            },
            client_service_1.ClientService,
            ...(0, client_repository_provider_1.provideClientRepository)(),
        ],
        exports: [...(0, client_repository_provider_1.provideClientRepository)()],
    })
], ClientModule);
//# sourceMappingURL=client.module.js.map