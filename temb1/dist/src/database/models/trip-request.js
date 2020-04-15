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
const address_1 = __importDefault(require("./address"));
const trip_details_1 = __importDefault(require("./trip-details"));
const driver_1 = __importDefault(require("./driver"));
const cab_1 = __importDefault(require("./cab"));
const provider_1 = __importDefault(require("./provider"));
const department_1 = __importDefault(require("./department"));
const homebase_1 = __importDefault(require("./homebase"));
var TripTypes;
(function (TripTypes) {
    TripTypes["regular"] = "Regular Trip";
    TripTypes["airportTransfer"] = "Airport Transfer";
    TripTypes["embassyVisit"] = "Embassy Visit";
})(TripTypes = exports.TripTypes || (exports.TripTypes = {}));
var TripStatus;
(function (TripStatus) {
    TripStatus["pending"] = "Pending";
    TripStatus["approved"] = "Approved";
    TripStatus["confirmed"] = "Confirmed";
    TripStatus["inTransit"] = "InTransit";
    TripStatus["cancelled"] = "Cancelled";
    TripStatus["completed"] = "Completed";
    TripStatus["declinedByOps"] = "DeclinedByOps";
    TripStatus["declinedByManager"] = "DeclinedByManager";
    TripStatus["pendingConfirmation"] = "PendingConfirmation";
})(TripStatus = exports.TripStatus || (exports.TripStatus = {}));
let TripRequest = class TripRequest extends base_1.Base {
    get pickup() { return this.origin.get(); }
};
__decorate([
    sequelize_typescript_1.Column({
        allowNull: false,
    }),
    __metadata("design:type", String)
], TripRequest.prototype, "name", void 0);
__decorate([
    sequelize_typescript_1.Column({
        allowNull: false,
        type: sequelize_typescript_1.DataType.TEXT,
    }),
    __metadata("design:type", String)
], TripRequest.prototype, "reason", void 0);
__decorate([
    sequelize_typescript_1.Column({
        allowNull: false,
        type: sequelize_typescript_1.DataType.ENUM(...base_1.enumToStringArray(TripTypes)),
    }),
    __metadata("design:type", String)
], TripRequest.prototype, "tripType", void 0);
__decorate([
    sequelize_typescript_1.Column({
        defaultValue: 1,
    }),
    __metadata("design:type", Number)
], TripRequest.prototype, "noOfPassengers", void 0);
__decorate([
    sequelize_typescript_1.Column({
        allowNull: false,
        type: sequelize_typescript_1.DataType.ENUM(...base_1.enumToStringArray(TripStatus)),
    }),
    __metadata("design:type", String)
], TripRequest.prototype, "tripStatus", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], TripRequest.prototype, "distance", void 0);
__decorate([
    sequelize_typescript_1.Column(sequelize_typescript_1.DataType.FLOAT),
    __metadata("design:type", Number)
], TripRequest.prototype, "cost", void 0);
__decorate([
    sequelize_typescript_1.Column(sequelize_typescript_1.DataType.TEXT),
    __metadata("design:type", String)
], TripRequest.prototype, "operationsComment", void 0);
__decorate([
    sequelize_typescript_1.Column(sequelize_typescript_1.DataType.TEXT),
    __metadata("design:type", String)
], TripRequest.prototype, "managerComment", void 0);
__decorate([
    sequelize_typescript_1.Column(sequelize_typescript_1.DataType.TEXT),
    __metadata("design:type", String)
], TripRequest.prototype, "tripNotTakenReason", void 0);
__decorate([
    sequelize_typescript_1.Column(sequelize_typescript_1.DataType.TEXT),
    __metadata("design:type", String)
], TripRequest.prototype, "tripNote", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], TripRequest.prototype, "rating", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], TripRequest.prototype, "approvalDate", void 0);
__decorate([
    sequelize_typescript_1.Column({
        allowNull: false,
    }),
    __metadata("design:type", String)
], TripRequest.prototype, "departureTime", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], TripRequest.prototype, "arrivalTime", void 0);
__decorate([
    sequelize_typescript_1.Column,
    sequelize_typescript_1.ForeignKey(() => user_1.default),
    __metadata("design:type", Number)
], TripRequest.prototype, "requestedById", void 0);
__decorate([
    sequelize_typescript_1.Column,
    sequelize_typescript_1.ForeignKey(() => user_1.default),
    __metadata("design:type", Number)
], TripRequest.prototype, "riderId", void 0);
__decorate([
    sequelize_typescript_1.Column,
    sequelize_typescript_1.ForeignKey(() => user_1.default),
    __metadata("design:type", Number)
], TripRequest.prototype, "approvedById", void 0);
__decorate([
    sequelize_typescript_1.Column,
    sequelize_typescript_1.ForeignKey(() => user_1.default),
    __metadata("design:type", Number)
], TripRequest.prototype, "confirmedById", void 0);
__decorate([
    sequelize_typescript_1.Column,
    sequelize_typescript_1.ForeignKey(() => user_1.default),
    __metadata("design:type", Number)
], TripRequest.prototype, "declinedById", void 0);
__decorate([
    sequelize_typescript_1.Column,
    sequelize_typescript_1.ForeignKey(() => address_1.default),
    __metadata("design:type", Number)
], TripRequest.prototype, "originId", void 0);
__decorate([
    sequelize_typescript_1.Column,
    sequelize_typescript_1.ForeignKey(() => address_1.default),
    __metadata("design:type", Number)
], TripRequest.prototype, "destinationId", void 0);
__decorate([
    sequelize_typescript_1.Column,
    sequelize_typescript_1.ForeignKey(() => trip_details_1.default),
    __metadata("design:type", Number)
], TripRequest.prototype, "tripDetailId", void 0);
__decorate([
    sequelize_typescript_1.Column,
    sequelize_typescript_1.ForeignKey(() => provider_1.default),
    __metadata("design:type", Number)
], TripRequest.prototype, "providerId", void 0);
__decorate([
    sequelize_typescript_1.Column,
    sequelize_typescript_1.ForeignKey(() => cab_1.default),
    __metadata("design:type", Number)
], TripRequest.prototype, "cabId", void 0);
__decorate([
    sequelize_typescript_1.Column,
    sequelize_typescript_1.ForeignKey(() => driver_1.default),
    __metadata("design:type", Number)
], TripRequest.prototype, "driverId", void 0);
__decorate([
    sequelize_typescript_1.Column,
    sequelize_typescript_1.ForeignKey(() => department_1.default),
    __metadata("design:type", Number)
], TripRequest.prototype, "departmentId", void 0);
__decorate([
    sequelize_typescript_1.Column,
    sequelize_typescript_1.ForeignKey(() => homebase_1.default),
    __metadata("design:type", Number)
], TripRequest.prototype, "homebaseId", void 0);
__decorate([
    sequelize_typescript_1.BelongsTo(() => user_1.default, 'requestedById'),
    __metadata("design:type", user_1.default)
], TripRequest.prototype, "requester", void 0);
__decorate([
    sequelize_typescript_1.BelongsTo(() => user_1.default, 'riderId'),
    __metadata("design:type", user_1.default)
], TripRequest.prototype, "rider", void 0);
__decorate([
    sequelize_typescript_1.BelongsTo(() => user_1.default, 'approvedById'),
    __metadata("design:type", user_1.default)
], TripRequest.prototype, "approver", void 0);
__decorate([
    sequelize_typescript_1.BelongsTo(() => user_1.default, 'confirmedById'),
    __metadata("design:type", user_1.default)
], TripRequest.prototype, "confirmer", void 0);
__decorate([
    sequelize_typescript_1.BelongsTo(() => user_1.default, 'declinedById'),
    __metadata("design:type", user_1.default)
], TripRequest.prototype, "decliner", void 0);
__decorate([
    sequelize_typescript_1.BelongsTo(() => address_1.default, 'originId'),
    __metadata("design:type", address_1.default)
], TripRequest.prototype, "origin", void 0);
__decorate([
    sequelize_typescript_1.BelongsTo(() => address_1.default, 'destinationId'),
    __metadata("design:type", address_1.default)
], TripRequest.prototype, "destination", void 0);
__decorate([
    sequelize_typescript_1.BelongsTo(() => trip_details_1.default),
    __metadata("design:type", trip_details_1.default)
], TripRequest.prototype, "tripDetail", void 0);
__decorate([
    sequelize_typescript_1.BelongsTo(() => provider_1.default),
    __metadata("design:type", provider_1.default)
], TripRequest.prototype, "provider", void 0);
__decorate([
    sequelize_typescript_1.BelongsTo(() => cab_1.default),
    __metadata("design:type", cab_1.default)
], TripRequest.prototype, "cab", void 0);
__decorate([
    sequelize_typescript_1.BelongsTo(() => driver_1.default),
    __metadata("design:type", driver_1.default)
], TripRequest.prototype, "driver", void 0);
__decorate([
    sequelize_typescript_1.BelongsTo(() => department_1.default),
    __metadata("design:type", department_1.default)
], TripRequest.prototype, "department", void 0);
__decorate([
    sequelize_typescript_1.BelongsTo(() => homebase_1.default),
    __metadata("design:type", homebase_1.default)
], TripRequest.prototype, "homebase", void 0);
TripRequest = __decorate([
    sequelize_typescript_1.Table({
        timestamps: true,
    })
], TripRequest);
exports.default = TripRequest;
//# sourceMappingURL=trip-request.js.map