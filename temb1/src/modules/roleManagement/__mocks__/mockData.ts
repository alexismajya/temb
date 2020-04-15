const mockedRoles = [
  {
    get: ({ plain }: { plain: boolean }) => {
      if (plain) {
        return {
          id: 1,
          name: 'Super Admin',
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

const mockdatas = [{ id: 1, name: 'Super Admin' }, { id: 2, name: 'test' }];

const mockRoleDetails = {
  get: ({ plain }: { plain: boolean }) => {
    if (plain) {
      return {
        id: 1,
        name: 'Super Admin',
      };
    }
  },
};

const mockData = {
  mockedRoles,
  mockdatas,
  mockRoleDetails,
};

export default mockData;
