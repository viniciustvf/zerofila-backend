"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Client = void 0;
const openapi = require("@nestjs/swagger");
class Client {
    constructor(id, name, telefone, fila, position, lastFilaId, entryTime, exitTime) {
        this.id = id;
        this.name = name;
        this.telefone = telefone;
        this.fila = fila;
        this.position = position;
        this.lastFilaId = lastFilaId;
    }
    static _OPENAPI_METADATA_FACTORY() {
        return {};
    }
}
exports.Client = Client;
//# sourceMappingURL=client.entity.js.map