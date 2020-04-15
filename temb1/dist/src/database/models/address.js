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
const location_1 = __importDefault(require("./location"));
const homebase_1 = __importDefault(require("./homebase"));
const Embassy_1 = __importDefault(require("./Embassy"));
let Address = class Address extends base_1.Base {
};
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], Address.prototype, "address", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Boolean)
], Address.prototype, "isDefault", void 0);
__decorate([
    sequelize_typescript_1.Column,
    sequelize_typescript_1.ForeignKey(() => location_1.default),
    __metadata("design:type", Number)
], Address.prototype, "locationId", void 0);
__decorate([
    sequelize_typescript_1.Column,
    sequelize_typescript_1.ForeignKey(() => homebase_1.default),
    __metadata("design:type", Number)
], Address.prototype, "homebaseId", void 0);
__decorate([
    sequelize_typescript_1.BelongsTo(() => location_1.default),
    __metadata("design:type", location_1.default)
], Address.prototype, "location", void 0);
__decorate([
    sequelize_typescript_1.BelongsTo(() => homebase_1.default, 'homebaseId'),
    __metadata("design:type", homebase_1.default)
], Address.prototype, "homebase", void 0);
__decorate([
    sequelize_typescript_1.HasMany(() => Embassy_1.default, 'addressId'),
    __metadata("design:type", Array)
], Address.prototype, "embassies", void 0);
Address = __decorate([
    sequelize_typescript_1.Table
], Address);
exports.default = Address;
//# sourceMappingURL=address.js.map