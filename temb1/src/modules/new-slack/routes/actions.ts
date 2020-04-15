const prefix = 'user_route_';
const userRouteActions = Object.freeze({
  userJoinRoute: `${prefix}join`,
  back: `${prefix}back`,
  selectManagerSubmit: `${prefix}select_manager`,
  confirmJoining: `${prefix}confirm`,
  showAvailableRoutes: `${prefix}show_available`,
  searchPopup: `${prefix}search_popup`,
  searchRouteSubmit: `${prefix}search`,
  page: `${prefix}page`,
  skipPage: `${prefix}skip_page`,
  skipPageSubmit: `${prefix}skip_page_submit`,
  pickupLocation: `${prefix}pickup_location`,
  locationNotFound: `${prefix}location_not_found`,
  confirmLocation: `${prefix}confirma_location`,
});

export default userRouteActions;
