"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Fila = void 0;
const openapi = require("@nestjs/swagger");
class Fila {
    constructor(id, name, max, url, status, empresa, clients, calledClient) {
        this.id = id;
        this.name = name;
        this.max = max;
        this.url = url;
        this.status = status;
        this.empresa = empresa;
        this.clients = clients;
        this.calledClient = calledClient;
    }
    static _OPENAPI_METADATA_FACTORY() {
        return {};
    }
}
exports.Fila = Fila;
//# sourceMappingURL=fila.entity.js.map