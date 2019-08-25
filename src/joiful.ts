import * as Joi from 'joi';
import { JoifulOptions } from './decorators/common';
import { createAnyPropertyDecorator } from './decorators/any';
import { createArrayPropertyDecorator, ArrayPropertyDecoratorOptions } from './decorators/array';
import { createBooleanPropertyDecorator } from './decorators/boolean';
import { createDatePropertyDecorator } from './decorators/date';
import { createFunctionPropertyDecorator } from './decorators/function';
import { createLazyPropertyDecorator } from './decorators/lazy';
import { createNumberPropertyDecorator } from './decorators/number';
import { createObjectPropertyDecorator, ObjectPropertyDecoratorOptions } from './decorators/object';
import { createStringPropertyDecorator } from './decorators/string';
import { Validator, createValidatePropertyDecorator } from './validation';
import { checkJoiIsCompatible, getJoi } from './core';

export class Joiful {
    constructor(private readonly options: JoifulOptions = {}) {
        checkJoiIsCompatible(options.joi);
    }

    get joi() {
        return getJoi(this.options);
    }

    /**
     * Property decorator that allows the property to be any type.
     */
    any = () => createAnyPropertyDecorator(this.options);

    /**
     * Property decorator that constrains the property to be an array.
     */
    array = (options?: ArrayPropertyDecoratorOptions) => createArrayPropertyDecorator(options, this.options);

    /**
     * Property decorator that constrains the property to be a boolean.
     */
    boolean = () => createBooleanPropertyDecorator(this.options);

    /**
     * Property decorator that constrains the property to be a Date.
     */
    date = () => createDatePropertyDecorator(this.options);

    /**
     * Property decorator that constrains the property to be a Function.
     */
    func = () => createFunctionPropertyDecorator(this.options);

    /**
     * Property decorator that constrains the property to a late bound schema.
     * This allows defining classes that reference themself. e.g.
     *
     * @example
     * class TreeNode {
     *   @jf.string().required()
     *   title: string;
     *
     *   @jf.lazy((joi) => joi.array().items(getJoiSchema(TreeNode, joi)))
     *   children: TreeNode[];
     * }
     */
    lazy = (getSchema: ({ joi }: { joi: typeof Joi }) => Joi.Schema) =>
        createLazyPropertyDecorator(getSchema, this.options)

    /**
     * Property decorator that constrains the property to be a number.
     */
    number = () => createNumberPropertyDecorator(this.options);

    /**
     * Property decorator that constrains the property to be an object.
     */
    object = (options?: ObjectPropertyDecoratorOptions) => createObjectPropertyDecorator(options, this.options);

    /**
     * Property decorator that constrains the property to be a string.
     */
    string = () => createStringPropertyDecorator(this.options);

    /**
     * Method decorator that validates that parameters passed into the method.
     */
    validate = (options?: { validator?: Validator }) => createValidatePropertyDecorator(options);
}
