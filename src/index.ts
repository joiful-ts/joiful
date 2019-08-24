import { Joiful } from './joiful';

export { Validator, MultipleValidationError, ValidationResult, isValidationPass, isValidationFail } from './validation';
export { Joiful } from './joiful';

export const DEFAULT_INSTANCE = new Joiful();

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
} = DEFAULT_INSTANCE;

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
