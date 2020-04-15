export interface RouteRatingsModel {
  RouteBatchName: string;
  Average: number;
  Route: string;
  NumberOfRatings: number;
}

export interface IRouteUsageModel {
  Route: string;
  RouteBatch: string;
  percentageUsage: number;
  users: number;
}
