import { LocationController } from '../location.controller';
import { mockLocationService } from './location.service';
import { mockLogger } from '../../shared/logging/__mocks__/logger';

const mockLocationController = new LocationController(mockLocationService, mockLogger);
export default mockLocationController;
