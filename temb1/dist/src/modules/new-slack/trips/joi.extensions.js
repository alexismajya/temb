"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.greaterThan = (joi) => {
    return {
        base: joi.string(),
        name: 'string',
        language: {
            greaterThan: 'must be greater than {{greaterThan}}',
            lessThan: 'must be less than {{lessThan}}',
        },
        rules: [
            {
                name: 'greaterThan',
                params: {
                    greaterThan: joi.alternatives([joi.string().required(), joi.func().ref()]),
                },
                validate(params, value, state, options) {
                    const prev = params.greaterThan;
                    if (value < prev) {
                        return this.createError('string.greaterThan', { value, greaterThan: params.greaterThan }, state, options);
                    }
                    return value;
                },
            },
            {
                name: 'lessThan',
                params: {
                    lessThan: joi.alternatives([joi.string().required(), joi.func().ref()]),
                },
                validate(params, value, state, options) {
                    const prev = params.lessThan;
                    if (value > prev) {
                        return this.createError('string.lessThan', { value, lessThan: params.lessThan }, state, options);
                    }
                    return value;
                },
            },
        ],
    };
};
//# sourceMappingURL=joi.extensions.js.map