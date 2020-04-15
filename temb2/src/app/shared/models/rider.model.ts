export interface IDeserializedRider {
    name: string;
    picture: string;
    routeName: string;
}

export interface IRider {
  picture: string;
  user: {
    name: string;
  };
  batchRecord: {
    batch: {
      route: {
        name: string;
      }
    }
  };
}
