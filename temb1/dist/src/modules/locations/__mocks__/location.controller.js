"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const location_controller_1 = require("../location.controller");
const location_service_1 = require("./location.service");
const logger_1 = require("../../shared/logging/__mocks__/logger");
const mockLocationController = new location_controller_1.LocationController(location_service_1.mockLocationService, logger_1.mockLogger);
exports.default = mockLocationController;
//# sourceMappingURL=location.controller.js.map