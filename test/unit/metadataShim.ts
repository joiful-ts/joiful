/**
 * reflect-metadata provides a shim for metadata, implemented as a global map.
 * Consuming code needs to import the module *once* throughout the entire application.
 * Importing the module in more than one consuming module will give you a new map each time.
 * Library code should not import this module!
 */
import "reflect-metadata";