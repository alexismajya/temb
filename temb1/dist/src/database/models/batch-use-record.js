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
const route_use_record_1 = __importDefault(require("./route-use-record"));
var BatchUseRecordStatuses;
(function (BatchUseRecordStatuses) {
    BatchUseRecordStatuses["notConfirmed"] = "NotConfirmed";
    BatchUseRecordStatuses["confirmed"] = "Confirmed";
    BatchUseRecordStatuses["skip"] = "Skip";
    BatchUseRecordStatuses["pending"] = "Pending";
})(BatchUseRecordStatuses = exports.BatchUseRecordStatuses || (exports.BatchUseRecordStatuses = {}));
let BatchUseRecord = class BatchUseRecord extends base_1.Base {
    get routeBatch() {
        return this.batchRecord ? this.batchRecord.batch : null;
    }
};
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.ENUM(...base_1.enumToStringArray(BatchUseRecordStatuses)),
        allowNull: false,
        defaultValue: BatchUseRecordStatuses.notConfirmed,
    }),
    __metadata("design:type", String)
], BatchUseRecord.prototype, "userAttendStatus", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], BatchUseRecord.prototype, "reasonForSkip", void 0);
__decorate([
    sequelize_typescript_1.Column({
        defaultValue: 0,
    }),
    __metadata("design:type", Number)
], BatchUseRecord.prototype, "rating", void 0);
__decorate([
    sequelize_typescript_1.Column,
    sequelize_typescript_1.ForeignKey(() => route_use_record_1.default),
    __metadata("design:type", Number)
], BatchUseRecord.prototype, "batchRecordId", void 0);
__decorate([
    sequelize_typescript_1.Column,
    sequelize_typescript_1.ForeignKey(() => user_1.default),
    __metadata("design:type", Number)
], BatchUseRecord.prototype, "userId", void 0);
__decorate([
    sequelize_typescript_1.BelongsTo(() => route_use_record_1.default, 'batchRecordId'),
    __metadata("design:type", route_use_record_1.default)
], BatchUseRecord.prototype, "batchRecord", void 0);
__decorate([
    sequelize_typescript_1.BelongsTo(() => user_1.default),
    __metadata("design:type", user_1.default)
], BatchUseRecord.prototype, "user", void 0);
BatchUseRecord = __decorate([
    sequelize_typescript_1.Table
], BatchUseRecord);
exports.default = BatchUseRecord;
//# sourceMappingURL=batch-use-record.js.map