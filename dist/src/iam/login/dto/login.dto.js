"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const empresa_dto_1 = require("../../../empresa/dto/empresa.dto");
class LoginDto extends (0, swagger_1.PickType)(empresa_dto_1.EmpresaDto, [
    'email',
    'password',
]) {
    static _OPENAPI_METADATA_FACTORY() {
        return {};
    }
}
exports.LoginDto = LoginDto;
//# sourceMappingURL=login.dto.js.map