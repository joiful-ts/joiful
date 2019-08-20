import * as Joi from 'joi';
import { createArrayPropertyDecorator, ArrayPropertyDecoratorOptions } from './decorators/array';
import { JoifulOptions } from './decorators/common';
import { createDatePropertyDecorator } from './decorators/date';
import { createFunctionPropertyDecorator } from './decorators/function';
import { createLazyPropertyDecorator } from './decorators/lazy';
import { createNumberPropertyDecorator } from './decorators/number';
import { createStringPropertyDecorator } from './decorators/string';
import { Validator, createValidatePropertyDecorator } from './validation';
import { createObjectPropertyDecorator, ObjectPropertyDecoratorOptions } from './decorators/object';
import { createBooleanPropertyDecorator } from './decorators/boolean';

export class Joiful {
    constructor(options?: JoifulOptions) {
        this.options = options || {};
    }

    private readonly options: JoifulOptions;

    get joi() {
        return (this.options && this.options.joi) || Joi;
    }

    array = (options?: ArrayPropertyDecoratorOptions) => createArrayPropertyDecorator(options, this.options);

    boolean = () => createBooleanPropertyDecorator(this.options);

    date = () => createDatePropertyDecorator(this.options);

    func = () => createFunctionPropertyDecorator(this.options);

    lazy = (getSchema: ({ joi }: { joi: typeof Joi }) => Joi.Schema) =>
        createLazyPropertyDecorator(getSchema, this.options)

    number = () => createNumberPropertyDecorator(this.options);

    object = (options?: ObjectPropertyDecoratorOptions) => createObjectPropertyDecorator(options, this.options);

    string = () => createStringPropertyDecorator(this.options);

    validate = (options?: { validator?: Validator }) => createValidatePropertyDecorator(options);
}
