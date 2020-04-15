import EditTripHelpers from './slack-edit-trip-helpers';
import NewSlackHelpers from './slack-helpers';
import {
  tripInfo, responseUrl, allDepartments, homebaseName, addresses,
  undefinedOption, otherOption,
} from './__mocks__';

describe('EditTripHelpers', () => {
  it('should getEditRequestModal', () => {
    jest.spyOn(NewSlackHelpers, 'getAddresses').mockResolvedValue(addresses);

    EditTripHelpers.getEditRequestModal(
      tripInfo, responseUrl, allDepartments, homebaseName
    );

    expect(NewSlackHelpers.getAddresses).toBeCalled();
  });
  it('should generateSelectedOption', () => {
    const selectedOption = EditTripHelpers.generateSelectedOption(undefinedOption);
    expect(selectedOption).toEqual(otherOption);
  });
});
