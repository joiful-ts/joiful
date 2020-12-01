import { Joiful } from './joiful';
import { Validator } from './validation';

export { Validator, MultipleValidationError, ValidationResult, isValidationPass, isValidationFail } from './validation';
export { Joiful } from './joiful';

export const DEFAULT_INSTANCE = new Joiful();

const DEFAULT_VALIDATOR = new Validator();
const { validate, validateAsClass, validateArrayAsClass } = DEFAULT_VALIDATOR;

const {
    any,
    array,
    boolean,
    date,
    func,
    joi,
    link,
    number,
    object,
    string,
    validateParams,
    getSchema,
    hasSchema,
} = DEFAULT_INSTANCE;

export {
    any,
    array,
    boolean,
    date,
    func,
    joi,
    link,
    number,
    object,
    string,
    validate,
    validateAsClass,
    validateArrayAsClass,
    validateParams,
    getSchema,
    hasSchema,
};
