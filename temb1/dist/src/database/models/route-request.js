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
const engagement_1 = __importDefault(require("./engagement"));
const user_1 = __importDefault(require("./user"));
const address_1 = __importDefault(require("./address"));
const homebase_1 = __importDefault(require("./homebase"));
var RouteRequestStatuses;
(function (RouteRequestStatuses) {
    RouteRequestStatuses["pending"] = "Pending";
    RouteRequestStatuses["approved"] = "Approved";
    RouteRequestStatuses["declined"] = "Declined";
    RouteRequestStatuses["confirmed"] = "Confirmed";
})(RouteRequestStatuses = exports.RouteRequestStatuses || (exports.RouteRequestStatuses = {}));
let RouteRequest = class RouteRequest extends base_1.Base {
};
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.DOUBLE,
    }),
    __metadata("design:type", Number)
], RouteRequest.prototype, "distance", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], RouteRequest.prototype, "opsComment", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], RouteRequest.prototype, "managerComment", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.DOUBLE,
    }),
    __metadata("design:type", Number)
], RouteRequest.prototype, "busStopDistance", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], RouteRequest.prototype, "routeImageUrl", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.ENUM(...base_1.enumToStringArray(RouteRequestStatuses)),
        allowNull: false,
    }),
    __metadata("design:type", String)
], RouteRequest.prototype, "status", void 0);
__decorate([
    sequelize_typescript_1.Column,
    sequelize_typescript_1.ForeignKey(() => engagement_1.default),
    __metadata("design:type", Number)
], RouteRequest.prototype, "engagementId", void 0);
__decorate([
    sequelize_typescript_1.Column,
    sequelize_typescript_1.ForeignKey(() => user_1.default),
    __metadata("design:type", Number)
], RouteRequest.prototype, "requesterId", void 0);
__decorate([
    sequelize_typescript_1.Column,
    sequelize_typescript_1.ForeignKey(() => user_1.default),
    __metadata("design:type", Number)
], RouteRequest.prototype, "managerId", void 0);
__decorate([
    sequelize_typescript_1.Column,
    sequelize_typescript_1.ForeignKey(() => user_1.default),
    __metadata("design:type", Number)
], RouteRequest.prototype, "opsReviewerId", void 0);
__decorate([
    sequelize_typescript_1.Column,
    sequelize_typescript_1.ForeignKey(() => address_1.default),
    __metadata("design:type", Number)
], RouteRequest.prototype, "busStopId", void 0);
__decorate([
    sequelize_typescript_1.Column,
    sequelize_typescript_1.ForeignKey(() => address_1.default),
    __metadata("design:type", Number)
], RouteRequest.prototype, "homeId", void 0);
__decorate([
    sequelize_typescript_1.Column,
    sequelize_typescript_1.ForeignKey(() => homebase_1.default),
    __metadata("design:type", Number)
], RouteRequest.prototype, "homebaseId", void 0);
__decorate([
    sequelize_typescript_1.BelongsTo(() => engagement_1.default),
    __metadata("design:type", engagement_1.default)
], RouteRequest.prototype, "engagement", void 0);
__decorate([
    sequelize_typescript_1.BelongsTo(() => user_1.default, 'managerId'),
    __metadata("design:type", user_1.default)
], RouteRequest.prototype, "manager", void 0);
__decorate([
    sequelize_typescript_1.BelongsTo(() => user_1.default, 'opsReviewerId'),
    __metadata("design:type", user_1.default)
], RouteRequest.prototype, "opsReviewer", void 0);
__decorate([
    sequelize_typescript_1.BelongsTo(() => user_1.default, 'requesterId'),
    __metadata("design:type", user_1.default)
], RouteRequest.prototype, "requester", void 0);
__decorate([
    sequelize_typescript_1.BelongsTo(() => address_1.default, 'busStopId'),
    __metadata("design:type", address_1.default)
], RouteRequest.prototype, "busStop", void 0);
__decorate([
    sequelize_typescript_1.BelongsTo(() => address_1.default, 'homeId'),
    __metadata("design:type", address_1.default)
], RouteRequest.prototype, "home", void 0);
__decorate([
    sequelize_typescript_1.BelongsTo(() => homebase_1.default),
    __metadata("design:type", homebase_1.default)
], RouteRequest.prototype, "homebase", void 0);
RouteRequest = __decorate([
    sequelize_typescript_1.Table
], RouteRequest);
exports.default = RouteRequest;
//# sourceMappingURL=route-request.js.map