import PaginationHelpers from './pagination-helpers';
import { payload, routes } from  './__mocks__/pagination';

describe(PaginationHelpers, () => {

  describe(PaginationHelpers.getPageNumber, () => {
    it('should get page number ', () => {
      const message = PaginationHelpers.getPageNumber(payload);
      expect(message).toBeDefined();
    });
  });

  describe(PaginationHelpers.addPaginationButtons, () => {
    it('should add pagination buttons ', () => {
      const message = PaginationHelpers.addPaginationButtons(routes, 'availableRoutes',
      'user_trip_page', 'user_route_pagination', 'user_trip_skipPage');
      expect(message).toBeDefined();
    });
  });

  describe(PaginationHelpers.createPaginationBlock, () => {
    it('should create pagination block ', () => {
        // if page number is less or equal to 1
      const pageOne = PaginationHelpers.createPaginationBlock(
            'user_trip_pagination', 'upcomingTrips', 1, 2,
            'user_trip_page', 'user_trip_skipPage',
        );
      expect(pageOne).toBeDefined();
        // if page number is greater than number of pages
      const pageTwo = PaginationHelpers.createPaginationBlock(
            'user_trip_pagination', 'upcomingTrips', 2, 2,
            'user_trip_page', 'user_trip_skipPage',
        );
      expect(pageTwo).toBeDefined();
        // if page number is less than number of page
      const pageThree = PaginationHelpers.createPaginationBlock(
            'user_trip_pagination', 'upcomingTrips', 3, 5,
            'user_trip_page', 'user_trip_skipPage',
        );
      expect(pageThree).toBeDefined();
    });
  });
});
