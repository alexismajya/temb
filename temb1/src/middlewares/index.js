import UserValidator from './UserValidator';
import AddressValidator from './AddressValidator';
import GeneralValidator from './GeneralValidator';
import tokenValidator from './TokenValidator';
import RouteValidator from './RouteValidator';
import RouteRequestValidator from './RouteRequestValidator';
import TripValidator from './TripValidator';
import CabsValidator from './CabsValidator';
import CleanRequestBody from './CleanRequestBody';
import CountryValidator from './CountryValidator';
import HomebaseValidator from './HomebaseValidator';
import ProviderValidator from './ProviderValidator';
import DriversValidator from './DriversValidator';
import HomebaseFilterValidator from './HomeBaseFilterValidator';
import mainValidator from './mainValidor';

const middleware = {
  UserValidator,
  AddressValidator,
  GeneralValidator,
  TokenValidator: tokenValidator,
  RouteValidator,
  RouteRequestValidator,
  TripValidator,
  CabsValidator,
  CleanRequestBody,
  DriversValidator,
  CountryValidator,
  HomebaseValidator,
  ProviderValidator,
  HomebaseFilterValidator,
  mainValidator
};

export default middleware;
