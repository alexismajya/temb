var returnMockedData = function () { return [
    {
        'userId': 2,
        'batchRecordId': 2,
        'userCount': '4',
        'user': {
            'name': 'Gracious',
            'email': 'test@test.com'
        },
        'batchRecord': {
            'batchId': 10,
            'batch': {
                'batch': 'A',
                'route': { 'name': 'Emelie' }
            }
        },
        'picture': 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'
    },
]; };
export var riders = {
    'data': {
        'firstFiveMostFrequentRiders': returnMockedData(),
        'leastFiveFrequentRiders': returnMockedData(),
    }
};
//# sourceMappingURL=mock.data.js.map