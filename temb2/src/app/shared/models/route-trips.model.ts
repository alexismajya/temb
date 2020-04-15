import { Moment } from 'moment';

interface RBatch {
    batch: string;
    cabDetails: { regNumber: string; };
    route: RRoute;
    takeOff: string;
}

interface RRoute {
    destination: { address: string; };
    name: string;
}

export interface IRouteTrips {
    id: number;
    averageRating: number;
    batch: RBatch;
    batchId: number;
    batchUseDate: Moment;
    confirmedUsers: number;
    createdAt: string;
    pendingUsers: number;
    skippedUsers: number;
    unConfirmedUsers: number;
    updatedAt: string;
    utilization: number;
}
