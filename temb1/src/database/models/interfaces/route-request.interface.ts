export interface IRouteRequest {
  requesterId?: number;
  engagementId?:number;
  managerId?:number;
  homeId?:number;
  busStopId?:number;
  routeImageUrl?:string;
  opsComment?:string;
  managerComment?:string;
  distance?:number;
  busStopDistance?:number;
  status?: 'Pending' | 'Declined' | 'Approved' | 'Confirmed';
}
