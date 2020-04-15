import { of } from 'rxjs';
import providerMock from 'src/app/__mocks__/providers.mock';
export var providerServiceMock = {
    getProviders: function () {
        return of([providerMock]);
    },
    getViableProviders: function () {
        return of({ data: [] });
    }
};
//# sourceMappingURL=providers.mock.js.map