import { Joiful } from './joiful';

export { Validator, MultipleValidationError } from './validation';
export { Joiful } from './joiful';

const defaultInstance = new Joiful();

const {
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
