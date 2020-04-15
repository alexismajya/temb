import { Marker, RoutesHelper } from '../../../helpers/googleMaps/googleMapsHelpers';
import GoogleMapsStatic from '../GoogleMapsStatic';
import GoogleMapsDirections from '../GoogleMapsDirections';
import { addressService } from '../../../modules/addresses/address.service';

describe('Google map static', () => {
  beforeAll(async () => {
    GoogleMapsDirections.getDirections = jest.fn(() => ({
      routes: [{
        overview_polyline: {
          points: 'ThePath'
        }
      }]
    }));

    addressService.findAddress = jest.fn(() => ({
      dataValues: {
        location: {
          latitude: 2.432678,
          longitude: 4.324671
        }
      }
    }));
  });

  it('should be able to fetch an image from google', async () => {
    const markers = [new Marker('blue', 'A')];
    markers[0].addLocation('The Dojo');

    const imageUrl = await GoogleMapsStatic.getLocationScreenshot(markers);
    expect(/^https:\/\/maps.googleapis/.test(imageUrl)).toBe(true);
  });

  it('should get path from dojo to drop off', async () => {
    jest.spyOn(GoogleMapsDirections, 'getDirections').mockResolvedValue({
      routes: [{
        overview_polyline: {
          points: 2
        },
      }]
    });
    jest.spyOn(RoutesHelper, 'getDojoCoordinateFromDb').mockResolvedValue({
      location: {
        latitude: 1.2555,
        longitude: -0.4567
      }
    });
    const imageUrl = await GoogleMapsStatic.getPathFromDojoToDropOff(
      'destination',
      '500x500',
      '13',
      '5',
      'red'
    );

    expect(/^https:\/\/maps.googleapis.com\/maps\/api\/staticmap\?size=500x500/.test(imageUrl))
      .toEqual(true);
  });

  it('should get path from dojo to drop off', async () => {
    const imageUrl = await GoogleMapsStatic.getPathFromDojoToDropOff(
      'destination',
    );

    expect(/^https:\/\/maps.googleapis.com\/maps\/api\/staticmap\?size=700x700/.test(imageUrl))
      .toEqual(true);
  });
});

describe('generateQueryParams', () => {
  it('should generate the correct params', () => {
    const markers = [new Marker('blue', 'A')];
    markers[0].addLocation('The Dojo');

    const stringedMarkers = GoogleMapsStatic.generateQueryParams(markers);
    expect(stringedMarkers).toEqual('&markers=color:blue|label:A|The Dojo');
  });
});
