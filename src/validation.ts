import { getJoiSchema, AnyClass, WORKING_SCHEMA_KEY, Constructor } from './core';
import * as Joi from 'joi';

export class MultipleValidationError extends Error {
    constructor(
        public readonly errors: Joi.ValidationError[],
    ) {
        super();

        (<any>Object).setPrototypeOf(this, MultipleValidationError.prototype);
    }
}

export interface ValidationResultPass<T> {
    error: null;
    value: T;
}

export interface ValidationResultFail<T> {
    error: Joi.ValidationError;
    value: T;
}

export type ValidationResult<T> = ValidationResultPass<T> | ValidationResultFail<T>;

/**
 * Returns true if validation result passed validation.
 * @param validationResult The validation result to test.
 */
export function isValidationPass<T>(
    validationResult: ValidationResult<T>,
): validationResult is ValidationResultPass<T> {
    return !validationResult.error;
}

/**
 * Returns true if validation result failed validation.
 * @param validationResult The validation result to test.
 */
export function isValidationFail<T>(
    validationResult: ValidationResult<T>,
): validationResult is ValidationResultFail<T> {
    return !!validationResult.error;
}

export class InvalidValidationTarget extends Error {
    constructor() {
        super('Cannot validate null or undefined');
    }
}

export class Validator {
    constructor(
        private defaultOptions?: Joi.ValidationOptions,
    ) {
    }

    /**
     * Validates an instance of a decorated class.
     * @param target Instance of decorated class to validate.
     * @param options Optional validation options to use.
     */
    validate<T extends {} | null | undefined>(target: T, options?: Joi.ValidationOptions): ValidationResult<T> {
        if (target === null || target === undefined) {
            throw new InvalidValidationTarget();
        }
        return this.validateAsClass(target, target.constructor as AnyClass, options);
    }

    /**
     * Validates a plain old javascript object against a decorated class.
     * @param target Object to validate.
     * @param clz Decorated class to validate against.
     * @param options Optional validation options to use.
     */
    validateAsClass<
        TClass extends Constructor<any>,
        TInstance = TClass extends Constructor<infer TInstance> ? TInstance : never
    >(
        target: Partial<TInstance> | null | undefined,
        Class: TClass,
        options: Joi.ValidationOptions | undefined = this.defaultOptions,
    ): ValidationResult<TInstance> {
        if (target === null || target === undefined) {
            throw new InvalidValidationTarget();
        }

        const classSchema: Joi.ObjectSchema = getJoiSchema(Class);

        if (options) {
            return Joi.validate(target, classSchema, options) as ValidationResult<TInstance>;
        } else {
            return Joi.validate(target, classSchema) as ValidationResult<TInstance>;
        }
    }

    /**
     * Validates an array of plain old javascript objects against a decorated class.
     * @param target Objects to validate.
     * @param clz Decorated class to validate against.
     * @param options Optional validation options to use.
     */
    validateArrayAsClass<T>(
        target: T[],
        Class: Constructor<T>,
        options: Joi.ValidationOptions | undefined = this.defaultOptions,
    ): ValidationResult<T[]> {
        if (target === null || target === undefined) {
            throw new InvalidValidationTarget();
        }

        const classSchema: Joi.ObjectSchema = getJoiSchema(Class);
        const arraySchema = Joi.array().items(classSchema);

        if (options) {
            return Joi.validate(target, arraySchema, options);
        } else {
            return Joi.validate(target, arraySchema);
        }
    }
}

export const createValidatePropertyDecorator = (options: { validator?: Validator } | undefined): MethodDecorator => {
    const validator = (options || { validator: undefined }).validator || new Validator();

    return (target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor) => {
        const original = descriptor.value;
        descriptor.value = function (this: any, ...args: any[]) {
            const types = Reflect.getMetadata('design:paramtypes', target, propertyKey);
            const failures: Joi.ValidationError[] = [];
            const newArgs: any[] = [];
            for (let i = 0; i < args.length; i++) {
                const arg = args[i];
                const argType = types[i];
                // TODO: Use `getWorkingSchema`?
                const workingSchema = Reflect.getMetadata(WORKING_SCHEMA_KEY, argType.prototype);
                if (workingSchema) {
                    let result = validator.validateAsClass(arg, argType);
                    if (result.error != null) {
                        failures.push(result.error);
                    }
                    newArgs.push(result.value);
                } else {
                    newArgs.push(arg);
                }
            }
            if (failures.length > 0) {
                throw new MultipleValidationError(failures);
            } else {
                return original.apply(this, newArgs);
            }
        };
        return descriptor;
    };
};
