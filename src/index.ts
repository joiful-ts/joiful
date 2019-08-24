import { defaultInstance } from './core';

export { Validator, MultipleValidationError, ValidationResult, isValidationPass, isValidationFail } from './validation';
export { Joiful } from './joiful';

const {
    any,
    array,
    boolean,
    date,
    func,
    joi,
    lazy,
    number,
    object,
    string,
    validate,
} = defaultInstance;

export {
    any,
    array,
    boolean,
    date,
    func,
    joi,
    lazy,
    number,
    object,
    string,
    validate,
};
