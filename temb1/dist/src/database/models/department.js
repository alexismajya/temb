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
const sequelize_1 = require("sequelize");
const base_1 = require("../base");
const user_1 = __importDefault(require("./user"));
const homebase_1 = __importDefault(require("./homebase"));
const team_details_1 = __importDefault(require("./team-details"));
var DepartmentStatuses;
(function (DepartmentStatuses) {
    DepartmentStatuses["active"] = "Active";
    DepartmentStatuses["inactive"] = "Inactive";
})(DepartmentStatuses = exports.DepartmentStatuses || (exports.DepartmentStatuses = {}));
let Department = class Department extends base_1.Base {
};
__decorate([
    sequelize_typescript_1.Column({
        unique: true,
    }),
    __metadata("design:type", String)
], Department.prototype, "name", void 0);
__decorate([
    sequelize_typescript_1.Column({
        allowNull: false,
    }),
    sequelize_typescript_1.ForeignKey(() => team_details_1.default),
    __metadata("design:type", String)
], Department.prototype, "teamId", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.ENUM(...base_1.enumToStringArray(DepartmentStatuses)),
        defaultValue: DepartmentStatuses.active,
    }),
    __metadata("design:type", String)
], Department.prototype, "status", void 0);
__decorate([
    sequelize_typescript_1.ForeignKey(() => user_1.default),
    __metadata("design:type", Number)
], Department.prototype, "headId", void 0);
__decorate([
    sequelize_typescript_1.ForeignKey(() => homebase_1.default),
    __metadata("design:type", Number)
], Department.prototype, "homebaseId", void 0);
__decorate([
    sequelize_typescript_1.BelongsTo(() => user_1.default),
    __metadata("design:type", user_1.default)
], Department.prototype, "head", void 0);
__decorate([
    sequelize_typescript_1.BelongsTo(() => homebase_1.default),
    __metadata("design:type", homebase_1.default)
], Department.prototype, "homebase", void 0);
Department = __decorate([
    sequelize_typescript_1.DefaultScope(() => ({
        where: {
            status: DepartmentStatuses.active,
        },
    })),
    sequelize_typescript_1.Scopes(() => ({
        all: {
            where: {
                status: { [sequelize_1.Op.or]: [DepartmentStatuses.active, DepartmentStatuses.inactive] },
            },
        },
        inactive: {
            where: {
                status: DepartmentStatuses.inactive,
            },
        },
    })),
    sequelize_typescript_1.Table
], Department);
exports.default = Department;
//# sourceMappingURL=department.js.map