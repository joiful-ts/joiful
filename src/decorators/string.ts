import * as Joi from 'joi';
import { TypedPropertyDecorator } from '../core';
import { ModifierProviders, JoifulOptions, createPropertyDecorator } from './common';
import { AnySchemaModifiers, getAnySchemaModifierProviders } from './any';
import { EmailOptions } from 'joi';

export interface StringSchemaModifiers extends AnySchemaModifiers {
    /**
     * The string doesn't only contain alphanumeric characters.
     */
    alphanum(): this;

    /**
     * The string is not a valid credit card number.
     */
    creditCard(): this;

    /**
     * Specifies that value must be a valid e-mail.
     */
    email(options?: EmailOptions): this;

    /**
     * Specifies the exact string length required.
     * @param length The required string length.
     * @param encoding If specified, the string length is calculated in bytes using the provided encoding.
     */
    exactLength(length: number, encoding?: string): this;

    /**
     * Requires the string value to be a valid GUID.
     * @param options Optional. options.version specifies one or more acceptable versions.
     * Can be an array or string with the following values: uuidv1, uuidv2, uuidv3, uuidv4, or uuidv5.
     * If no version is specified then it is assumed to be a generic guid which will not validate the
     * version or variant of the guid and just check for general structure format.
     */
    guid(options?: Joi.GuidOptions): this;

    /**
     * Requires the string value to be a valid hexadecimal string.
     */
    hex(): this;

    /**
     * Requires the string value to be a valid hostname as per RFC1123.
     */
    hostname(): this;

    /**
     * Allows the value to match any value in the allowed list or disallowed list in a case insensitive comparison.
     * e.g. `@jf.string().valid('a').insensitive()`
     */
    insensitive(): this;

    /**
     * Requires the string value to be a valid ip address.
     * @param options optional settings:
     *  version - One or more IP address versions to validate against. Valid values: ipv4, ipv6, ipvfuture
     *  cidr - Used to determine if a CIDR is allowed or not. Valid values: optional, required, forbidden
     */
    ip(options?: Joi.IpOptions): this;

    /**
     * Requires the string value to be in valid ISO 8601 date format.
     * If the validation convert option is on (enabled by default),
     * the string will be forced to simplified extended ISO format (ISO 8601).
     * Be aware that this operation uses javascript Date object,
     * which does not support the full ISO format, so a few formats might not pass when using convert.
     */
    isoDate(): this;

    /**
     * Specifies that the string must be in lowercase.
     */
    lowercase(): this;

    /**
     * Specifies the maximum length.
     * @param length The maximum length.
     */
    max(length: number): this;

    /**
     * Specifies the minimum length.
     * @param length The minimum length.
     */
    min(length: number): this;

    /**
     * Defines a pattern rule.
     * @param pattern A regular expression object the string value must match against.
     * @param name Optional name for patterns (useful with multiple patterns).
     */
    pattern(pattern: RegExp, name?: string): this;

    /**
     * Defines a pattern rule.
     * @param pattern A regular expression object the string value must match against.
     * @param name Optional name for patterns (useful with multiple patterns).
     */
    regex(pattern: RegExp, name?: string): this;

    /**
     * Replace characters matching the given pattern with the specified replacement string.
     * @param pattern A regular expression object to match against, or a string of which
     *   all occurrences will be replaced.
     * @param replacement The string that will replace the pattern.
     */
    replace(pattern: RegExp, replacement: string): this;

    /**
     * Requires the string value to only contain a-z, A-Z, 0-9, and underscore _.
     */
    token(): this;

    /**
     * Requires the string value to contain no whitespace before or after.
     * If the validation convert option is on (enabled by default), the string will be trimmed.
     */
    trim(): this;

    /**
     * Specifies that the string must be in uppercase.
     */
    uppercase(): this;

    /**
     * Requires the string value to be a valid RFC 3986 URI.
     * @param options Optional settings:
     *   scheme - Specifies one or more acceptable Schemes, should only include the scheme name.
     *     Can be an Array or String (strings are automatically escaped for use in a Regular Expression).
     *   allowRelative - Allow relative URIs. Defaults to false.
     *   relativeOnly - Restrict only relative URIs. Defaults to false.
     *   allowQuerySquareBrackets - Allows unencoded square brackets inside the query string.
     *     This is NOT RFC 3986 compliant but query strings like abc[]=123&abc[]=456 are very
     *     common these days. Defaults to false.
     *   domain - Validate the domain component using the options specified in string.domain().
     */
    uri(options?: Joi.UriOptions): this;
}

export function getStringSchemaModifierProviders(getJoi: () => typeof Joi) {
    const result: ModifierProviders<Joi.StringSchema, StringSchemaModifiers> = {
        ...getAnySchemaModifierProviders(getJoi),
        alphanum: () => ({ schema }) => schema.alphanum(),
        creditCard: () => ({ schema }) => schema.creditCard(),
        email: (options?: Joi.EmailOptions) => ({ schema }) => schema.email(options),
        exactLength: (length: number) => ({ schema }) => schema.length(length),
        guid: (options?: Joi.GuidOptions) => ({ schema }) => schema.guid(options),
        hex: () => ({ schema }) => schema.hex(),
        hostname: () => ({ schema }) => schema.hostname(),
        insensitive: () => ({ schema }) => schema.insensitive(),
        ip: (options?: Joi.IpOptions) => ({ schema }) => schema.ip(options),
        isoDate: () => ({ schema }) => schema.isoDate(),
        lowercase: () => ({ schema }) => schema.lowercase(),
        max: (length: number) => ({ schema }) => schema.max(length),
        min: (length: number) => ({ schema }) => schema.min(length),
        pattern: (pattern: RegExp, name?: string) => ({ schema }) => schema.regex(pattern, name),
        regex: (pattern: RegExp, name?: string) => ({ schema }) => schema.regex(pattern, name),
        replace: (pattern: RegExp, replacement: string) => ({ schema }) => schema.replace(pattern, replacement),
        token: () => ({ schema }) => schema.token(),
        trim: () => ({ schema }) => schema.trim(),
        uppercase: () => ({ schema }) => schema.uppercase(),
        uri: (options?: Joi.UriOptions) => ({ schema }) => schema.uri(options),
    };
    return result;
}

export interface StringSchemaDecorator extends
    StringSchemaModifiers,
    TypedPropertyDecorator<string> {
}

export const createStringPropertyDecorator = (joifulOptions: JoifulOptions) => (
    createPropertyDecorator<string, StringSchemaModifiers>()(
        ({ joi }) => joi.string(),
        getStringSchemaModifierProviders,
        joifulOptions,
    )
);
