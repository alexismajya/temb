"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const startDate = 'AAAAAA';
const endDate = 'BBBBBB';
const workHours = 'CCC-DDD';
const id = 12;
const fellow = {
    id: 1,
    slackId: 'FFFFFF',
    email: 'BBBBBB.CCCCCC@localhost'
};
const partner = {
    name: 'GGGGGG',
    id: 1
};
const fellowId = fellow.id;
const partnerId = partner.id;
const updateStartDate = 'AAAAAA';
const updateEndDate = 'BBBBBB';
const updateWorkHours = 'CCC-DDD';
exports.engagement = {
    id,
    startDate,
    endDate,
    workHours,
    fellowId,
    partnerId,
    fellow,
    partner
};
exports.updateEngagement = Object.assign(Object.assign({}, exports.engagement), { startDate: updateStartDate, endDate: updateEndDate, workHours: updateWorkHours });
//# sourceMappingURL=engagementMocks.js.map