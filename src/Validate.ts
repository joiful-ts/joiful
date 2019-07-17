import { Validator } from './Validator';
import { WORKING_SCHEMA_KEY } from './core';
import { MultipleValidationError } from './MultipleValidationError';
import { ValidationError } from '@hapi/joi';

export function Validate(validator: Validator): MethodDecorator {
    return (target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor) => {
        const original = descriptor.value;
        descriptor.value = function (...args: any[]) {
            const types = Reflect.getMetadata('design:paramtypes', target, propertyKey);
            const failures: ValidationError[] = [];
            const newArgs: any[] = [];
            for (let i = 0; i < args.length; i++) {
                const arg = args[i];
                const argType = types[i];
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
                // tslint:disable-next-line:no-invalid-this
                return original.apply(this, newArgs);
            }
        };
        return descriptor;
    };
}
