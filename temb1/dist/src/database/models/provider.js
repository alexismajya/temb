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
const user_1 = __importDefault(require("./user"));
const cab_1 = __importDefault(require("./cab"));
const driver_1 = __importDefault(require("./driver"));
const homebase_1 = __importDefault(require("./homebase"));
const trip_request_1 = __importDefault(require("./trip-request"));
var ProviderNotificationChannel;
(function (ProviderNotificationChannel) {
    ProviderNotificationChannel["directMessage"] = "0";
    ProviderNotificationChannel["channel"] = "1";
    ProviderNotificationChannel["email"] = "2";
    ProviderNotificationChannel["whatsapp"] = "3";
})(ProviderNotificationChannel = exports.ProviderNotificationChannel || (exports.ProviderNotificationChannel = {}));
let Provider = class Provider extends base_1.Base {
    get isDirectMessage() {
        return this.notificationChannel === ProviderNotificationChannel.directMessage;
    }
};
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], Provider.prototype, "name", void 0);
__decorate([
    sequelize_typescript_1.Column({
        allowNull: true,
    }),
    __metadata("design:type", String)
], Provider.prototype, "channelId", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], Provider.prototype, "email", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], Provider.prototype, "phoneNo", void 0);
__decorate([
    sequelize_typescript_1.Column({
        allowNull: false,
        type: sequelize_typescript_1.DataType.ENUM(...base_1.enumToStringArray(ProviderNotificationChannel)),
    }),
    __metadata("design:type", String)
], Provider.prototype, "notificationChannel", void 0);
__decorate([
    sequelize_typescript_1.Column,
    sequelize_typescript_1.ForeignKey(() => user_1.default),
    __metadata("design:type", Number)
], Provider.prototype, "providerUserId", void 0);
__decorate([
    sequelize_typescript_1.Column,
    sequelize_typescript_1.ForeignKey(() => homebase_1.default),
    __metadata("design:type", Number)
], Provider.prototype, "homebaseId", void 0);
__decorate([
    sequelize_typescript_1.Column({
        defaultValue: false,
    }),
    __metadata("design:type", Boolean)
], Provider.prototype, "verified", void 0);
__decorate([
    sequelize_typescript_1.BelongsTo(() => user_1.default, 'providerUserId'),
    __metadata("design:type", user_1.default)
], Provider.prototype, "user", void 0);
__decorate([
    sequelize_typescript_1.BelongsTo(() => homebase_1.default),
    __metadata("design:type", homebase_1.default)
], Provider.prototype, "homebase", void 0);
__decorate([
    sequelize_typescript_1.HasMany(() => cab_1.default),
    __metadata("design:type", Array)
], Provider.prototype, "vehicles", void 0);
__decorate([
    sequelize_typescript_1.HasMany(() => driver_1.default),
    __metadata("design:type", Array)
], Provider.prototype, "drivers", void 0);
__decorate([
    sequelize_typescript_1.HasMany(() => trip_request_1.default),
    __metadata("design:type", Array)
], Provider.prototype, "trips", void 0);
Provider = __decorate([
    sequelize_typescript_1.Table({
        paranoid: true,
        timestamps: true,
    })
], Provider);
exports.default = Provider;
//# sourceMappingURL=provider.js.map