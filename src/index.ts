import { Joiful } from './joiful';

export { Validator, MultipleValidationError, ValidationResult, isValidationPass, isValidationFail } from './validation';
export { Joiful } from './joiful';

const defaultInstance = new Joiful();

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
