import InputValidator from '../InputValidator';

describe('Input Validator test', () => {
  it('test empty space and white space', () => {
    const result = InputValidator.isEmptySpace(' s s');
    expect(result).toBe(true);
  });

  it('should test if a number is greater than 0', () => {
    const result = InputValidator.checkNumberGreaterThanZero('0', 'flightNo', 'flightNo');
    expect(result[0]).toHaveProperty('error', 'Minimum flightNo is 1');
  });

  it('should check duplicate values and return no error', () => {
    const result = InputValidator.checkDuplicateFieldValues(
      'Lekki', 'Kenya', 'pickup', 'destination'
    );
    expect(result).toEqual([]);
  });

  it('should check duplicate values and return errors', () => {
    const result = InputValidator.checkDuplicateFieldValues(
      'Kenya', 'Kenya', 'pickup', 'destination'
    );
    expect(result[0]).toHaveProperty('error', 'pickup and destination cannot be the same.');
  });

  it('should check if values given are google plus codes', () => {
    const result = InputValidator.checkValidCoordinates('fake coordinates');
    expect(result[0]).toHaveProperty('error', 'Not a valid plus code. Please input as shown in the hint');
  });

  it('should not throw error if valid coordinates are input', () => {
    const result = InputValidator.checkValidCoordinates('PVM5+HR Nairobi, Kenya');
    expect(result).toEqual([]);
  });

  it('should show error if wrong coordinates are input', () => {
    const result = InputValidator.checkValidCoordinates('fake coordinates');
    expect(result[0]).toHaveProperty('error', 'Not a valid plus code. Please input as shown in the hint');
  });
});
