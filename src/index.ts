import { Joiful } from './joiful';
import { Validator } from './validation';

export { AnySchemaDecorator } from './decorators/any';
export { ArrayPropertyDecoratorOptions, ArraySchemaDecorator } from './decorators/array';
export { BooleanSchemaDecorator } from './decorators/boolean';
export { DateSchemaDecorator } from './decorators/date';
export { FunctionSchemaDecorator } from './decorators/function';
export { LinkSchemaDecorator } from './decorators/link';
export { NumberSchemaDecorator } from './decorators/number';
export { ObjectSchemaDecorator } from './decorators/object';
export { StringSchemaDecorator } from './decorators/string';

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
