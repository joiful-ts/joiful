import core = require('./core');
import {MultipleValidationError} from './MultipleValidationError';
import {Validate} from './Validate';
import {Validator} from './Validator';

import any = require('./constraints/any');
import array = require('./constraints/array');
import booleanConstraints = require('./constraints/boolean');
import date = require('./constraints/date');
import func = require('./constraints/func');
import number = require('./constraints/number');
import object = require('./constraints/object');
import string = require('./constraints/string');

export = {
    core,
    MultipleValidationError,
    Validate,
    Validator,

    constraints: {
        any,
        array,
        boolean: booleanConstraints,
        date,
        func,
        number,
        object,
        string
    }
};