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
const role_1 = __importDefault(require("./role"));
const user_role_1 = __importDefault(require("./user-role"));
const partner_1 = __importDefault(require("./partner"));
const engagement_1 = __importDefault(require("./engagement"));
const address_1 = __importDefault(require("./address"));
const route_batch_1 = __importDefault(require("./route-batch"));
const homebase_1 = __importDefault(require("./homebase"));
const trip_request_1 = __importDefault(require("./trip-request"));
const batch_use_record_1 = __importDefault(require("./batch-use-record"));
let User = class User extends base_1.Base {
    get partner() {
        return this.partners && Array.isArray(this.partners) ? this.partners[0] : null;
    }
};
__decorate([
    sequelize_typescript_1.Column({
        allowNull: false,
        type: sequelize_typescript_1.DataType.STRING,
    }),
    __metadata("design:type", String)
], User.prototype, "name", void 0);
__decorate([
    sequelize_typescript_1.Column({
        allowNull: false,
        unique: true,
        type: sequelize_typescript_1.DataType.STRING,
    }),
    __metadata("design:type", String)
], User.prototype, "slackId", void 0);
__decorate([
    sequelize_typescript_1.Column({
        allowNull: true,
        unique: true,
        type: sequelize_typescript_1.DataType.STRING,
    }),
    __metadata("design:type", String)
], User.prototype, "phoneNo", void 0);
__decorate([
    sequelize_typescript_1.Column({
        unique: true,
        type: sequelize_typescript_1.DataType.STRING,
    }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    sequelize_typescript_1.Column({
        allowNull: true,
    }),
    sequelize_typescript_1.ForeignKey(() => address_1.default),
    __metadata("design:type", Number)
], User.prototype, "defaultDestinationId", void 0);
__decorate([
    sequelize_typescript_1.Column({
        allowNull: true,
    }),
    sequelize_typescript_1.ForeignKey(() => route_batch_1.default),
    __metadata("design:type", Number)
], User.prototype, "routeBatchId", void 0);
__decorate([
    sequelize_typescript_1.Column,
    sequelize_typescript_1.ForeignKey(() => homebase_1.default),
    __metadata("design:type", Number)
], User.prototype, "homebaseId", void 0);
__decorate([
    sequelize_typescript_1.BelongsTo(() => address_1.default, 'defaultDestinationId'),
    __metadata("design:type", Number)
], User.prototype, "busStop", void 0);
__decorate([
    sequelize_typescript_1.BelongsTo(() => route_batch_1.default),
    __metadata("design:type", route_batch_1.default)
], User.prototype, "routeBatch", void 0);
__decorate([
    sequelize_typescript_1.BelongsTo(() => homebase_1.default),
    __metadata("design:type", homebase_1.default)
], User.prototype, "homebase", void 0);
__decorate([
    sequelize_typescript_1.BelongsToMany(() => role_1.default, () => user_role_1.default),
    __metadata("design:type", Array)
], User.prototype, "roles", void 0);
__decorate([
    sequelize_typescript_1.BelongsToMany(() => partner_1.default, () => engagement_1.default),
    __metadata("design:type", Array)
], User.prototype, "partners", void 0);
__decorate([
    sequelize_typescript_1.HasMany(() => trip_request_1.default, 'requestedById'),
    __metadata("design:type", Array)
], User.prototype, "trips", void 0);
__decorate([
    sequelize_typescript_1.HasMany(() => batch_use_record_1.default, 'userId'),
    __metadata("design:type", Array)
], User.prototype, "routes", void 0);
User = __decorate([
    sequelize_typescript_1.Table({
        paranoid: true,
        timestamps: true,
    })
], User);
exports.default = User;
//# sourceMappingURL=user.js.map