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
const base_1 = require("../base");
const sequelize_typescript_1 = require("sequelize-typescript");
const user_1 = __importDefault(require("./user"));
const route_1 = __importDefault(require("./route"));
const driver_1 = __importDefault(require("./driver"));
const cab_1 = __importDefault(require("./cab"));
const homebase_1 = __importDefault(require("./homebase"));
const provider_1 = __importDefault(require("./provider"));
var RouteBatchStatuses;
(function (RouteBatchStatuses) {
    RouteBatchStatuses["active"] = "Active";
    RouteBatchStatuses["inActive"] = "Inactive";
})(RouteBatchStatuses = exports.RouteBatchStatuses || (exports.RouteBatchStatuses = {}));
let RouteBatch = class RouteBatch extends base_1.Base {
};
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], RouteBatch.prototype, "inUse", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], RouteBatch.prototype, "takeOff", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], RouteBatch.prototype, "batch", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], RouteBatch.prototype, "capacity", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.TEXT,
    }),
    __metadata("design:type", String)
], RouteBatch.prototype, "comments", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.ENUM(...base_1.enumToStringArray(RouteBatchStatuses)),
        defaultValue: RouteBatchStatuses.inActive,
    }),
    __metadata("design:type", String)
], RouteBatch.prototype, "status", void 0);
__decorate([
    sequelize_typescript_1.Column,
    sequelize_typescript_1.ForeignKey(() => route_1.default),
    __metadata("design:type", Number)
], RouteBatch.prototype, "routeId", void 0);
__decorate([
    sequelize_typescript_1.Column,
    sequelize_typescript_1.ForeignKey(() => cab_1.default),
    __metadata("design:type", Number)
], RouteBatch.prototype, "cabId", void 0);
__decorate([
    sequelize_typescript_1.Column,
    sequelize_typescript_1.ForeignKey(() => driver_1.default),
    __metadata("design:type", Number)
], RouteBatch.prototype, "driverId", void 0);
__decorate([
    sequelize_typescript_1.Column,
    sequelize_typescript_1.ForeignKey(() => homebase_1.default),
    __metadata("design:type", Number)
], RouteBatch.prototype, "homebaseId", void 0);
__decorate([
    sequelize_typescript_1.Column,
    sequelize_typescript_1.ForeignKey(() => provider_1.default),
    __metadata("design:type", Number)
], RouteBatch.prototype, "providerId", void 0);
__decorate([
    sequelize_typescript_1.HasMany(() => user_1.default),
    __metadata("design:type", Array)
], RouteBatch.prototype, "riders", void 0);
__decorate([
    sequelize_typescript_1.BelongsTo(() => route_1.default),
    __metadata("design:type", route_1.default)
], RouteBatch.prototype, "route", void 0);
__decorate([
    sequelize_typescript_1.BelongsTo(() => cab_1.default, 'cabId'),
    __metadata("design:type", cab_1.default)
], RouteBatch.prototype, "cabDetails", void 0);
__decorate([
    sequelize_typescript_1.BelongsTo(() => driver_1.default),
    __metadata("design:type", driver_1.default)
], RouteBatch.prototype, "driver", void 0);
__decorate([
    sequelize_typescript_1.BelongsTo(() => homebase_1.default),
    __metadata("design:type", homebase_1.default)
], RouteBatch.prototype, "homebase", void 0);
__decorate([
    sequelize_typescript_1.ForeignKey(() => provider_1.default),
    __metadata("design:type", provider_1.default)
], RouteBatch.prototype, "provider", void 0);
RouteBatch = __decorate([
    sequelize_typescript_1.Table({
        paranoid: true,
        timestamps: true,
    })
], RouteBatch);
exports.default = RouteBatch;
//# sourceMappingURL=route-batch.js.map