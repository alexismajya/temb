import { IProviderInventory } from 'src/app/shared/models/provider.model';

export const providersMock: IProviderInventory[] = [
  {
    id: 1,
    name: 'Uber Kenya',
    email: 'uberkenya@uber.com',
    user: {
      name: 'Uber',
      email: 'uber@uber.com',
      phoneNo: null,
      slackId: '',
    },
  },
  {
    id: 2,
    name: 'Taxify',
    email: 'taxify@taxify.com',
    user: {
      name: 'Taxify',
      email: 'taxify@taxify.com',
      phoneNo: null,
      slackId: ''
    }
  }
];
