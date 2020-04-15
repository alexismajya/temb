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
const country_1 = __importDefault(require("./country"));
const location_1 = __importDefault(require("./location"));
const user_1 = __importDefault(require("./user"));
const address_1 = __importDefault(require("./address"));
const provider_1 = __importDefault(require("./provider"));
let Homebase = class Homebase extends base_1.Base {
};
__decorate([
    sequelize_typescript_1.Column({
        unique: true,
    }),
    __metadata("design:type", String)
], Homebase.prototype, "name", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], Homebase.prototype, "channel", void 0);
__decorate([
    sequelize_typescript_1.Column({
        defaultValue: 'tembea@andela.com',
    }),
    __metadata("design:type", String)
], Homebase.prototype, "opsEmail", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], Homebase.prototype, "travelEmail", void 0);
__decorate([
    sequelize_typescript_1.ForeignKey(() => country_1.default),
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], Homebase.prototype, "countryId", void 0);
__decorate([
    sequelize_typescript_1.ForeignKey(() => address_1.default),
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], Homebase.prototype, "addressId", void 0);
__decorate([
    sequelize_typescript_1.Column,
    sequelize_typescript_1.ForeignKey(() => location_1.default),
    __metadata("design:type", Number)
], Homebase.prototype, "locationId", void 0);
__decorate([
    sequelize_typescript_1.BelongsTo(() => country_1.default, {
        onDelete: 'cascade',
        hooks: true,
    }),
    __metadata("design:type", country_1.default)
], Homebase.prototype, "country", void 0);
__decorate([
    sequelize_typescript_1.BelongsTo(() => address_1.default, 'addressId'),
    __metadata("design:type", address_1.default)
], Homebase.prototype, "address", void 0);
__decorate([
    sequelize_typescript_1.HasMany(() => user_1.default, 'homebaseId'),
    __metadata("design:type", Array)
], Homebase.prototype, "users", void 0);
__decorate([
    sequelize_typescript_1.BelongsTo(() => location_1.default, 'locationId'),
    __metadata("design:type", location_1.default)
], Homebase.prototype, "location", void 0);
__decorate([
    sequelize_typescript_1.HasMany(() => provider_1.default, 'homebaseId'),
    __metadata("design:type", Array)
], Homebase.prototype, "providers", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], Homebase.prototype, "currency", void 0);
Homebase = __decorate([
    sequelize_typescript_1.Table({
        paranoid: true,
        timestamps: true,
    })
], Homebase);
exports.default = Homebase;
//# sourceMappingURL=homebase.js.map