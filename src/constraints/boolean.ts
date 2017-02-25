import {BooleanSchema} from "joi";
import {typeConstraintDecorator, ConstraintDefinitionError, constraintDecorator} from "../core";

export namespace BooleanConstraints {
    export function BooleanSchema() : PropertyDecorator {
        return typeConstraintDecorator([Boolean], (Joi) => {
            return Joi.boolean();
        });
    }

    export function Truthy(...values : Array<string | boolean | number>) {
        if (values.length == 0) {
            throw new ConstraintDefinitionError("Truthy constraint must have one or more arguments.");
        } else {
            return constraintDecorator([Boolean], (schema : BooleanSchema) => {
                // TODO: update Joi type definitions
                return (<any> schema).truthy(...values);
            });
        }
    }

    export function Falsy(...values : Array<string | boolean | number>) {
        if (values.length == 0) {
            throw new ConstraintDefinitionError("Falsy constraint must have one or more arguments.");
        } else {
            return constraintDecorator([Boolean], (schema : BooleanSchema) => {
                // TODO: update Joi type definitions
                return (<any> schema).falsy(...values);
            });
        }
    }

    export function Insensitive(enabled : boolean = true) {
        return constraintDecorator([Boolean], (schema : BooleanSchema) => {
            // TODO: update Joi type definitions
            return (<any> schema).insensitive(enabled);
        });
    }
}
