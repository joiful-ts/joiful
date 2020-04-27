# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [2.0.1](https://github.com/joiful-ts/joiful/compare/v2.0.0...v2.0.1) (2020-04-27)


### Bug Fixes

* **validation:** issue 117: address feedback from code review ([76cdcaf](https://github.com/joiful-ts/joiful/commit/76cdcaf0d142d45c4e95068c2821b5669f1d504c))
* **validation:** issue 117: validator now accepts custom joi ([505f9cd](https://github.com/joiful-ts/joiful/commit/505f9cdfed471e183dd39ccc916466248eaabb93))

## [2.0.0](https://github.com/joiful-ts/joiful/compare/v1.1.9...v2.0.0) (2020-03-05)


### Features

* add getSchema & hasSchema functions ([3e9f9f5](https://github.com/joiful-ts/joiful/commit/3e9f9f5f4638d84666db0c7de5c6883686ed9307))

### [1.1.9](https://github.com/joiful-ts/joiful/compare/v1.1.8...v1.1.9) (2019-12-07)

### [1.1.8](https://github.com/joiful-ts/joiful/compare/v1.1.7...v1.1.8) (2019-12-07)

### [1.1.7](https://github.com/joiful-ts/joiful/compare/v1.1.6...v1.1.7) (2019-12-07)

### [1.1.6](https://github.com/joiful-ts/joiful/compare/v1.1.5...v1.1.6) (2019-10-23)

### [1.1.5](https://github.com/joiful-ts/joiful/compare/v1.1.4...v1.1.5) (2019-10-23)

### [1.1.4](https://github.com/joiful-ts/joiful/compare/v1.1.3...v1.1.4) (2019-10-23)

### [1.1.3](https://github.com/joiful-ts/joiful/compare/v1.1.2...v1.1.3) (2019-10-17)

### [1.1.2](https://github.com/joiful-ts/joiful/compare/v1.1.1...v1.1.2) (2019-10-13)

### [1.1.1](https://github.com/joiful-ts/joiful/compare/v1.1.0...v1.1.1) (2019-10-13)

## [1.1.0](https://github.com/joiful-ts/joiful/compare/v0.0.13...v1.1.0) (2019-10-05)


### Bug Fixes

* **build:** run check in precommit ([08a6497](https://github.com/joiful-ts/joiful/commit/08a6497))
* **core:** remove nested. replaced by object(Class) ([679c42c](https://github.com/joiful-ts/joiful/commit/679c42c))
* **core:** update to require node 8.10 ([49f32da](https://github.com/joiful-ts/joiful/commit/49f32da))
* **test:** fix bad calls in tests ([0c0281f](https://github.com/joiful-ts/joiful/commit/0c0281f))
* **test:** fix path to tsconfig file for tests ([58e61c8](https://github.com/joiful-ts/joiful/commit/58e61c8))
* **test:** rename fluent.ts to fluent.test.ts ([cb746bb](https://github.com/joiful-ts/joiful/commit/cb746bb))
* **test:** rename number.ts to number.test.ts ([597aeb5](https://github.com/joiful-ts/joiful/commit/597aeb5))


### Features

* **arrays:** add fluent api syntax to Ordered decorator ([f0885eb](https://github.com/joiful-ts/joiful/commit/f0885eb))
* **core:** add fluent api to Items decorator ([484b2c9](https://github.com/joiful-ts/joiful/commit/484b2c9))
* **core:** ensure Joiful is used only with compatible joi versions ([5ff4dae](https://github.com/joiful-ts/joiful/commit/5ff4dae))
* **core:** export decorators for default instance ([67addd8](https://github.com/joiful-ts/joiful/commit/67addd8))
* **core:** export validation funcs from index.ts ([00dc37f](https://github.com/joiful-ts/joiful/commit/00dc37f))
* **core:** fluent api for individual schema decorators ([0ac8efd](https://github.com/joiful-ts/joiful/commit/0ac8efd))
* **core:** new fluent decorator interface ([7991044](https://github.com/joiful-ts/joiful/commit/7991044))
* **core:** support fluent api via Joi decorator ([606b151](https://github.com/joiful-ts/joiful/commit/606b151))
* **core:** upgrade to joi 15, make joi normal dependency ([1314228](https://github.com/joiful-ts/joiful/commit/1314228))
* **lint:** add formatting linting rules ([025d242](https://github.com/joiful-ts/joiful/commit/025d242))
* **tests:** expect(x).toBeValid() will now display the candidate that failed ([3289111](https://github.com/joiful-ts/joiful/commit/3289111))

## [1.0.0](https://github.com/joiful-ts/joiful/compare/v0.0.13...v1.0.0) (2019-08-30)


### Bug Fixes

* **build:** run check in precommit ([08a6497](https://github.com/joiful-ts/joiful/commit/08a6497))
* **core:** remove nested. replaced by object(Class) ([679c42c](https://github.com/joiful-ts/joiful/commit/679c42c))
* **core:** update to require node 8.10 ([49f32da](https://github.com/joiful-ts/joiful/commit/49f32da))
* **test:** fix bad calls in tests ([0c0281f](https://github.com/joiful-ts/joiful/commit/0c0281f))
* **test:** fix path to tsconfig file for tests ([58e61c8](https://github.com/joiful-ts/joiful/commit/58e61c8))
* **test:** rename fluent.ts to fluent.test.ts ([cb746bb](https://github.com/joiful-ts/joiful/commit/cb746bb))
* **test:** rename number.ts to number.test.ts ([597aeb5](https://github.com/joiful-ts/joiful/commit/597aeb5))


### Features

* **arrays:** add fluent api syntax to Ordered decorator ([f0885eb](https://github.com/joiful-ts/joiful/commit/f0885eb))
* **core:** add fluent api to Items decorator ([484b2c9](https://github.com/joiful-ts/joiful/commit/484b2c9))
* **core:** ensure Joiful is used only with compatible joi versions ([5ff4dae](https://github.com/joiful-ts/joiful/commit/5ff4dae))
* **core:** export decorators for default instance ([67addd8](https://github.com/joiful-ts/joiful/commit/67addd8))
* **core:** export validation funcs from index.ts ([00dc37f](https://github.com/joiful-ts/joiful/commit/00dc37f))
* **core:** fluent api for individual schema decorators ([0ac8efd](https://github.com/joiful-ts/joiful/commit/0ac8efd))
* **core:** new fluent decorator interface ([7991044](https://github.com/joiful-ts/joiful/commit/7991044))
* **core:** support fluent api via Joi decorator ([606b151](https://github.com/joiful-ts/joiful/commit/606b151))
* **core:** upgrade to joi 15, make joi normal dependency ([1314228](https://github.com/joiful-ts/joiful/commit/1314228))
* **lint:** add formatting linting rules ([025d242](https://github.com/joiful-ts/joiful/commit/025d242))
* **tests:** expect(x).toBeValid() will now display the candidate that failed ([3289111](https://github.com/joiful-ts/joiful/commit/3289111))
