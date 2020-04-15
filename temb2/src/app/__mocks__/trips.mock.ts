export const tripsMock = {
  data: {
    trips: [
      {
        'totalTrips': 3,
        'totalCost': 300,
        'averageRating': 0,
        'department': 'People'
      },
      {
        'totalTrips': 1,
        'totalCost': 100,
        'averageRating': 0,
        'department': 'D1+ Programs'
      },
      {
        'totalTrips': 1,
        'totalCost': 100,
        'averageRating': 0,
        'department': 'Success'
      },
      {
        'totalTrips': 1,
        'totalCost': 100,
        'averageRating': 0,
        'department': 'Operations'
      }
    ],
    finalCost: 300,
    finalAverageRating: 1.67,
    count: 3
  }
};

export const travelMock = {
  data: [
    {
      departmentId: 1,
      departmentName: 'TDD',
      totalTrips: '2',
      averageRating: '3.50',
      totalCost: '80'
    }
  ],
  finalCost: 300,
  finalAverageRating: 1.67,
  count: 3
};

export const departmentsMock = {
  departments: [
    { name: 'TDD' },
    { name: 'People' },
    { name: 'Finance' },
  ],
};
