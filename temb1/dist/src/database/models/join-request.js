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
const user_1 = __importDefault(require("./user"));
const engagement_1 = __importDefault(require("./engagement"));
var JoinRequestStatuses;
(function (JoinRequestStatuses) {
    JoinRequestStatuses["pending"] = "Pending";
    JoinRequestStatuses["approved"] = "Approved";
    JoinRequestStatuses["declined"] = "Declined";
    JoinRequestStatuses["confirmed"] = "Confirmed";
})(JoinRequestStatuses = exports.JoinRequestStatuses || (exports.JoinRequestStatuses = {}));
let JoinRequest = class JoinRequest extends base_1.Base {
};
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], JoinRequest.prototype, "managerComment", void 0);
__decorate([
    sequelize_typescript_1.Column({
        allowNull: false,
        type: sequelize_typescript_1.DataType.ENUM(...base_1.enumToStringArray(JoinRequestStatuses)),
    }),
    __metadata("design:type", String)
], JoinRequest.prototype, "status", void 0);
__decorate([
    sequelize_typescript_1.Column,
    sequelize_typescript_1.ForeignKey(() => engagement_1.default),
    __metadata("design:type", Number)
], JoinRequest.prototype, "engagementId", void 0);
__decorate([
    sequelize_typescript_1.Column,
    sequelize_typescript_1.ForeignKey(() => route_batch_1.default),
    __metadata("design:type", Number)
], JoinRequest.prototype, "routeBatchId", void 0);
__decorate([
    sequelize_typescript_1.Column,
    sequelize_typescript_1.ForeignKey(() => user_1.default),
    __metadata("design:type", Number)
], JoinRequest.prototype, "managerId", void 0);
__decorate([
    sequelize_typescript_1.BelongsTo(() => engagement_1.default),
    __metadata("design:type", engagement_1.default)
], JoinRequest.prototype, "engagement", void 0);
__decorate([
    sequelize_typescript_1.BelongsTo(() => route_batch_1.default),
    __metadata("design:type", route_batch_1.default)
], JoinRequest.prototype, "routeBatch", void 0);
__decorate([
    sequelize_typescript_1.BelongsTo(() => user_1.default),
    __metadata("design:type", user_1.default)
], JoinRequest.prototype, "manager", void 0);
JoinRequest = __decorate([
    sequelize_typescript_1.Table
], JoinRequest);
exports.default = JoinRequest;
//# sourceMappingURL=join-request.js.map