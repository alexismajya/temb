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
const provider_1 = __importDefault(require("./provider"));
let Cab = class Cab extends base_1.Base {
};
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], Cab.prototype, "regNumber", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], Cab.prototype, "capacity", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], Cab.prototype, "model", void 0);
__decorate([
    sequelize_typescript_1.Column({
        allowNull: true,
        type: sequelize_typescript_1.DataType.STRING,
    }),
    __metadata("design:type", String)
], Cab.prototype, "color", void 0);
__decorate([
    sequelize_typescript_1.Column,
    sequelize_typescript_1.ForeignKey(() => provider_1.default),
    __metadata("design:type", Number)
], Cab.prototype, "providerId", void 0);
__decorate([
    sequelize_typescript_1.BelongsTo(() => provider_1.default),
    __metadata("design:type", provider_1.default)
], Cab.prototype, "provider", void 0);
Cab = __decorate([
    sequelize_typescript_1.Table({
        paranoid: true,
        timestamps: true,
    })
], Cab);
exports.default = Cab;
//# sourceMappingURL=cab.js.map