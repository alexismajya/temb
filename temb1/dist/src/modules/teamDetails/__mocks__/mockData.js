"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mockedTeamDetails = [
    {
        get: ({ plain }) => {
            if (plain) {
                return {
                    teamId: 'SAVEDTEAMID',
                    botId: 'string',
                    botToken: 'string',
                    teamName: 'T1',
                    userId: 'string',
                    userToken: 'string',
                    webhookConfigUrl: 'string',
                    opsChannelId: 'string',
                    teamUrl: 'string',
                };
            }
        },
    },
    {
        get: ({ plain }) => {
            if (plain) {
                return {
                    id: 2,
                    name: 'test',
                };
            }
        },
    },
];
exports.default = mockedTeamDetails;
//# sourceMappingURL=mockData.js.map