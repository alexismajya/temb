"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const BootJobs_1 = __importStar(require("../BootJobs"));
describe('BootJobsService', () => {
    afterEach(() => {
        jest.restoreAllMocks();
    });
    describe('scheduleJobs', () => {
        it('should return trip status when it being  passed', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(BootJobs_1.default, 'scheduleJobs');
            jest.spyOn(BootJobs_1.bootJobs, 'map').mockReturnValue();
            yield BootJobs_1.default.scheduleJobs();
            expect(BootJobs_1.bootJobs.map).toBeCalledTimes(1);
        }));
    });
});
//# sourceMappingURL=BootJobs.spec.js.map