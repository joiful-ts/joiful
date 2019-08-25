import { Validator } from '../../src/validation';
import { ToBeValidOptions } from '../@types/jest';

const tryToStringify = (value: any) => {
    try {
        return JSON.stringify(value, null, '  ');
    } catch (err) {
        return null;
    }
};

expect.extend({
    toBeValid(candidate: any, options: ToBeValidOptions) {
        const validator = (options && options.validator) || new Validator();
        const Class = options && options.Class;
        const result = Class ?
            validator.validateAsClass(candidate, Class) :
            validator.validate(candidate);

        const pass = result.error === null;
        // tslint:disable-next-line:no-invalid-this
        const isNot = this.isNot;
        const errorMessage = result.error && (result.error.message || result.error);

        const candidateAsString = tryToStringify(candidate);

        const message =
            `expected candidate to ${isNot ? 'fail' : 'pass'} validation` +
            (!candidateAsString ? '' : `:\n\n  ${candidateAsString.replace(/\n/gm, '\n  ')}\n\n${errorMessage}`.trim());

        return {
            pass,
            message: () => message,
        };
    },
});
