const mockedTeamDetails = [
  {
    get: ({ plain }: { plain: boolean }) => {
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
          teamUrl:'string',
        };
      }
    },
  },
  {
    get: ({ plain }: { plain: boolean }) => {
      if (plain) {
        return {
          id: 2,
          name: 'test',
        };
      }
    },
  },
];

// const upsertMock = () =>

export default mockedTeamDetails;
