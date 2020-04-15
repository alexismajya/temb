enum managerTripActions {
  approve = 'user_trip_manager_approve',
  decline = 'user_trip_manager_decline',
  reasonSubmission = 'user_trip_manager_reason',
  editApprovedTrip = 'user_trip_manager_edit',
  confirmApprovedTrip = 'user_trip_manager_confirm',
}

export enum managerTripBlocks {
  confirmTripRequest = 'MANAGER_CONFIRM_TRIP_REQUEST',
}

export default managerTripActions;
