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
const partner_1 = __importDefault(require("./partner"));
let Engagement = class Engagement extends base_1.Base {
};
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], Engagement.prototype, "startDate", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], Engagement.prototype, "endDate", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], Engagement.prototype, "workHours", void 0);
__decorate([
    sequelize_typescript_1.ForeignKey(() => partner_1.default),
    __metadata("design:type", Number)
], Engagement.prototype, "partnerId", void 0);
__decorate([
    sequelize_typescript_1.ForeignKey(() => user_1.default),
    __metadata("design:type", Number)
], Engagement.prototype, "fellowId", void 0);
__decorate([
    sequelize_typescript_1.BelongsTo(() => partner_1.default),
    __metadata("design:type", partner_1.default)
], Engagement.prototype, "partner", void 0);
__decorate([
    sequelize_typescript_1.BelongsTo(() => user_1.default),
    __metadata("design:type", user_1.default)
], Engagement.prototype, "fellow", void 0);
Engagement = __decorate([
    sequelize_typescript_1.Table
], Engagement);
exports.default = Engagement;
//# sourceMappingURL=engagement.js.map