import {BooleanSchema} from "joi";
import {typeConstraintDecorator} from "../core";

export function BooleanSchema() : PropertyDecorator {
    return typeConstraintDecorator([Boolean], (Joi : { boolean : () => BooleanSchema }) => {
        return Joi.boolean();
    });
}