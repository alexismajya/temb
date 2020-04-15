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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_typescript_1 = require("sequelize-typescript");
const base_1 = require("../base");
const address_1 = __importDefault(require("./address"));
const route_batch_1 = __importDefault(require("./route-batch"));
const homebase_1 = __importDefault(require("./homebase"));
let Route = class Route extends base_1.Base {
};
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], Route.prototype, "name", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.TEXT,
    }),
    __metadata("design:type", String)
], Route.prototype, "imageUrl", void 0);
__decorate([
    sequelize_typescript_1.Column,
    sequelize_typescript_1.ForeignKey(() => address_1.default),
    __metadata("design:type", Number)
], Route.prototype, "destinationId", void 0);
__decorate([
    sequelize_typescript_1.Column,
    sequelize_typescript_1.ForeignKey(() => homebase_1.default),
    __metadata("design:type", Number)
], Route.prototype, "homebaseId", void 0);
__decorate([
    sequelize_typescript_1.HasMany(() => route_batch_1.default),
    __metadata("design:type", Array)
], Route.prototype, "routeBatch", void 0);
__decorate([
    sequelize_typescript_1.BelongsTo(() => address_1.default),
    __metadata("design:type", address_1.default)
], Route.prototype, "destination", void 0);
__decorate([
    sequelize_typescript_1.BelongsTo(() => homebase_1.default),
    __metadata("design:type", homebase_1.default)
], Route.prototype, "homebase", void 0);
Route = __decorate([
    sequelize_typescript_1.Table
], Route);
exports.default = Route;
//# sourceMappingURL=route.js.map