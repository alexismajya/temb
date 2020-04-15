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
Object.defineProperty(exports, "__esModule", { value: true });
class SchedulerService {
    constructor(config, appEvents, httpClient, logger) {
        this.config = config;
        this.appEvents = appEvents;
        this.httpClient = httpClient;
        this.logger = logger;
    }
    schedule(data, retry = 3) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                data.payload.callbackUrl = data.payload.callbackUrl || this.config.defaultCallbackUrl;
                const options = {
                    url: this.config.url,
                    body: data,
                    headers: {
                        'client-id': this.config.clientId,
                        'client-secret': this.config.clientSecret,
                    },
                    json: true,
                };
                yield this.httpClient.post(options);
            }
            catch (err) {
                this.logger.error(err);
            }
        });
    }
    handleJob(job) {
        this.appEvents.broadcast(job);
    }
}
exports.SchedulerService = SchedulerService;
//# sourceMappingURL=scheduler.service.js.map