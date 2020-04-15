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
const route_batch_1 = __importDefault(require("./route-batch"));
const batch_use_record_1 = __importDefault(require("./batch-use-record"));
let RouteUseRecord = class RouteUseRecord extends base_1.Base {
};
__decorate([
    sequelize_typescript_1.Column({
        allowNull: true,
        defaultValue: 0,
    }),
    __metadata("design:type", Number)
], RouteUseRecord.prototype, "confirmedUsers", void 0);
__decorate([
    sequelize_typescript_1.Column({
        allowNull: true,
        defaultValue: 0,
    }),
    __metadata("design:type", Number)
], RouteUseRecord.prototype, "unConfirmedUsers", void 0);
__decorate([
    sequelize_typescript_1.Column({
        allowNull: true,
        defaultValue: 0,
    }),
    __metadata("design:type", Number)
], RouteUseRecord.prototype, "skippedUsers", void 0);
__decorate([
    sequelize_typescript_1.Column({
        allowNull: true,
        defaultValue: 0,
    }),
    __metadata("design:type", Number)
], RouteUseRecord.prototype, "pendingUsers", void 0);
__decorate([
    sequelize_typescript_1.Column({
        allowNull: false,
    }),
    __metadata("design:type", String)
], RouteUseRecord.prototype, "batchUseDate", void 0);
__decorate([
    sequelize_typescript_1.Column,
    sequelize_typescript_1.ForeignKey(() => route_batch_1.default),
    __metadata("design:type", Number)
], RouteUseRecord.prototype, "batchId", void 0);
__decorate([
    sequelize_typescript_1.BelongsTo(() => route_batch_1.default),
    __metadata("design:type", route_batch_1.default)
], RouteUseRecord.prototype, "batch", void 0);
__decorate([
    sequelize_typescript_1.HasMany(() => batch_use_record_1.default),
    __metadata("design:type", Array)
], RouteUseRecord.prototype, "records", void 0);
RouteUseRecord = __decorate([
    sequelize_typescript_1.Table
], RouteUseRecord);
exports.default = RouteUseRecord;
//# sourceMappingURL=route-use-record.js.map