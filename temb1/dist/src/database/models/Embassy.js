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
const address_1 = __importDefault(require("./address"));
const country_1 = __importDefault(require("./country"));
let Embassy = class Embassy extends sequelize_typescript_1.Model {
};
__decorate([
    sequelize_typescript_1.Column({
        unique: true,
    }),
    __metadata("design:type", String)
], Embassy.prototype, "name", void 0);
__decorate([
    sequelize_typescript_1.ForeignKey(() => address_1.default),
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], Embassy.prototype, "addressId", void 0);
__decorate([
    sequelize_typescript_1.ForeignKey(() => country_1.default),
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], Embassy.prototype, "countryId", void 0);
__decorate([
    sequelize_typescript_1.BelongsTo(() => address_1.default, 'addressId'),
    __metadata("design:type", address_1.default)
], Embassy.prototype, "address", void 0);
__decorate([
    sequelize_typescript_1.BelongsTo(() => country_1.default, 'countryId'),
    __metadata("design:type", country_1.default)
], Embassy.prototype, "country", void 0);
Embassy = __decorate([
    sequelize_typescript_1.Table({
        paranoid: true,
        timestamps: true,
    })
], Embassy);
exports.default = Embassy;
//# sourceMappingURL=Embassy.js.map