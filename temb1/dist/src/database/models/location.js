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
let Location = class Location extends base_1.Base {
};
__decorate([
    sequelize_typescript_1.Column({
        allowNull: false,
        type: sequelize_typescript_1.DataType.DOUBLE,
    }),
    __metadata("design:type", Number)
], Location.prototype, "longitude", void 0);
__decorate([
    sequelize_typescript_1.Column({
        allowNull: false,
        type: sequelize_typescript_1.DataType.DOUBLE,
    }),
    __metadata("design:type", Number)
], Location.prototype, "latitude", void 0);
__decorate([
    sequelize_typescript_1.HasOne(() => address_1.default),
    __metadata("design:type", address_1.default)
], Location.prototype, "address", void 0);
Location = __decorate([
    sequelize_typescript_1.Table
], Location);
exports.default = Location;
//# sourceMappingURL=location.js.map