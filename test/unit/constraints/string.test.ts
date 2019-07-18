import '../metadataShim';
import { registerJoi, WORKING_SCHEMA_KEY } from '../../../src/core';
import {
    Alphanum,
    CreditCard,
    Email,
    Guid,
    Hex,
    Hostname,
    Ip,
    IsoDate,
    Length,
    Lowercase,
    Max,
    Min,
    Regex,
    Replace,
    StringSchema,
    Token,
    Trim,
    Uppercase,
    Uri,
} from '../../../src/constraints/string';
import * as Joi from '@hapi/joi';
import { Validator } from '../../../src/Validator';
import { testConstraint, testConversion, testConstraintWithPojos } from '../testUtil';

registerJoi(Joi);

describe('String constraints', () => {
    describe('StringSchema', () => {
        class MyClass {
            @StringSchema()
            myProperty!: string;

            // Object wrappers are not supported
            // @StringSchema()
            // myOtherProperty! : String;
        }

        it('should annotate the class property', () => {
            const metadata = Reflect.getMetadata(WORKING_SCHEMA_KEY, MyClass.prototype);
            const expected = {
                myProperty: Joi.string(),
            };
            expect(metadata).toEqual(expected);
        });

        /**
         * TODO: test compilation failures
         */
        xit('should error when applied to a non-string property', () => {
            // expect(() => {
            //     class MyBadClass {
            //         @StringSchema()
            //         myBadProperty! : number;
            //     }
            //     return MyBadClass;
            // }).toThrow(ConstraintDefinitionError);
        });

        describe('when using fluent API', () => {
            class ForgotPasswordForm {
                @StringSchema((schema) => schema.email().required())
                emailAddress?: string;
            }

            testConstraintWithPojos(
                () => ForgotPasswordForm,
                [{ emailAddress: 'valid@example.com' }],
                [
                    {},
                    { emailAddress: 'invalid email' },
                ],
            );
        });
    });

    describe('Length, and core functionality', () => {
        it('should validate successful candidates', () => {
            class MyClass {
                @Length(5)
                @StringSchema()
                myProperty!: string;
            }

            const object = new MyClass();
            object.myProperty = 'abcde';
            expect(object).toBeValid();
        });

        it('should validate failing candidates', () => {
            class MyClass {
                @Length(5)
                @StringSchema()
                myProperty!: string;
            }

            const object = new MyClass();
            object.myProperty = 'abc';
            expect(object).not.toBeValid();
        });

        it('should validate successful candidate created from object literal', () => {
            class MyClass {
                @Length(5)
                @StringSchema()
                myProperty!: string;
            }

            const object = {
                myProperty: 'abcde',
            };
            const validator = new Validator();
            const result = validator.validateAsClass(object, MyClass);
            expect(result).toHaveProperty('error');
            expect(result.error).toBeNull();
        });

        it('should validate failing candidate created from object literal', () => {
            class MyClass {
                @Length(5)
                @StringSchema()
                myProperty!: string;
            }

            const object = {
                myProperty: 'abc',
            };
            const validator = new Validator();
            const result = validator.validateAsClass(object, MyClass);
            expect(result).toHaveProperty('error');
            expect(result.error).not.toBeNull();
        });

        it('should create Joi type schema derived from property type, if no type schema specified', () => {
            class MyClass {
                @Length(5)
                myProperty!: string;
            }

            let object = new MyClass();
            object.myProperty = 'abcde';
            expect(object).toBeValid();
        });
    });

    describe('Alphanum', () => {
        testConstraint<string>(
            () => {
                class MyClass {
                    @Alphanum()
                    myProperty: string;

                    constructor(myProperty: string) {
                        this.myProperty = myProperty;
                    }
                }
                return MyClass;
            },
            ['abcdEFG12390'],
            ['!@#$'],
        );
    });

    describe('CreditCard', () => {
        testConstraint<string>(
            () => {
                class MyClass {
                    @CreditCard()
                    myProperty: string;

                    constructor(myProperty: string) {
                        this.myProperty = myProperty;
                    }
                }
                return MyClass;
            },
            ['4444333322221111'],
            ['abcd', '1234', '4444-3333-2222-1111'],
        );
    });

    describe('Email', () => {
        testConstraint<string>(
            () => {
                class MyClass {
                    @Email()
                    myProperty: string;

                    constructor(myProperty: string) {
                        this.myProperty = myProperty;
                    }
                }
                return MyClass;
            },
            ['monkey@see.com', 'howdy+there@pardner.co.kr'],
            ['123.com', 'monkey@do'],
        );
    });

    describe('Guid', () => {
        testConstraint<string>(
            () => {
                class MyClass {
                    @Guid()
                    myProperty: string;

                    constructor(myProperty: string) {
                        this.myProperty = myProperty;
                    }
                }
                return MyClass;
            },
            ['3F2504E0-4F89-41D3-9A0C-0305E82C3301', '3f2504e0-4f89-41d3-9a0c-0305e82c3301'],
            ['123', 'abc'],
        );
    });

    describe('Hex', () => {
        testConstraint<string>(
            () => {
                class MyClass {
                    @Hex()
                    myProperty: string;

                    constructor(myProperty: string) {
                        this.myProperty = myProperty;
                    }
                }
                return MyClass;
            },
            ['AB', '0123456789abcdef', '0123456789ABCDEF', '123', 'FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF'],
            ['0xf', '0x0F', '0xAB', 'A B', 'jj'],
        );
    });

    describe('Hostname', () => {
        testConstraint<string>(
            () => {
                class MyClass {
                    @Hostname()
                    myProperty: string;

                    constructor(myProperty: string) {
                        this.myProperty = myProperty;
                    }
                }
                return MyClass;
            },
            [
                'www.thisisnotarealdomainnameoratleastihopeitsnot.com.au',
                'www.zxcv.ninja',
                '127.0.0.1',
            ],
            [
                'https://www.thisisnotarealdomainnameoratleastihopeitsnot.com.au',
                'www.zxcv.ninja/hello',
                'www.zxcv.ninja?query=meow',
            ],
        );
    });

    describe('Ip', () => {
        describe('no options', () => {
            testConstraint<string>(
                () => {
                    class MyClass {
                        @Ip()
                        myProperty: string;

                        constructor(myProperty: string) {
                            this.myProperty = myProperty;
                        }
                    }
                    return MyClass;
                },
                ['127.0.0.1', '127.0.0.1/24', '2001:0db8:0000:0000:0000:ff00:0042:8329'],
                ['abc.def.ghi.jkl', '123'],
            );
        });

        describe('IPv4', () => {
            testConstraint<string>(
                () => {
                    class MyClass {
                        @Ip({
                            version: 'ipv4',
                        })
                        myProperty: string;

                        constructor(myProperty: string) {
                            this.myProperty = myProperty;
                        }
                    }
                    return MyClass;
                },
                ['127.0.0.1', '127.0.0.1/24'],
                ['2001:0db8:0000:0000:0000:ff00:0042:8329'],
            );
        });

        describe('IPv6', () => {
            testConstraint<string>(
                () => {
                    class MyClass {
                        @Ip({
                            version: 'ipv6',
                        })
                        myProperty: string;

                        constructor(myProperty: string) {
                            this.myProperty = myProperty;
                        }
                    }
                    return MyClass;
                },
                [
                    '2001:0db8:0000:0000:0000:ff00:0042:8329',
                    '2001:db8:0:0:0:ff00:42:8329',
                    '2001:db8::ff00:42:8329',
                    '::1',
                ],
                [
                    '127.0.0.1',
                    '127.0.0.1/24',
                ],
            );
        });

        describe('CIDR required', () => {
            testConstraint<string>(
                () => {
                    class MyClass {
                        @Ip({
                            cidr: 'required',
                        })
                        myProperty: string;

                        constructor(myProperty: string) {
                            this.myProperty = myProperty;
                        }
                    }
                    return MyClass;
                },
                ['127.0.0.1/24', '2001:db8:abcd:8000::/50'],
                ['127.0.0.1', '2001:0db8:0000:0000:0000:ff00:0042:8329'],
            );
        });
    });

    describe('IsoDate', () => {
        testConstraint<string>(
            () => {
                class MyClass {
                    @IsoDate()
                    myProperty: string;

                    constructor(myProperty: string) {
                        this.myProperty = myProperty;
                    }
                }
                return MyClass;
            },
            [
                '2016-05-20',
                '2016-05-20T23:09:53+00:00',
                '2016-05-20T23:09:53Z',
                '2016-05-20T23:09:53', /*"20160520T230953Z"*/
            ],
            [
                '20-05-2016',
                '23:09:53',
                'abcd',
                String(new Date().valueOf()),
            ],
        );
    });

    describe('Lowercase', () => {
        class MyClass {
            @Lowercase()
            myProperty: string;

            constructor(myProperty: string) {
                this.myProperty = myProperty;
            }
        }

        describe('without conversion', () => {
            testConstraint<string>(
                () => MyClass,
                ['abcd123'],
                ['ABCD!@#'],
                {
                    convert: false,
                },
            );
        });

        describe('with conversion', () => {
            testConversion<string>(
                () => MyClass,
                (obj: MyClass) => obj.myProperty,
                [
                    ['ABCD123', 'abcd123'],
                ],
                ['abcd!@#'],
            );
        });
    });

    describe('Max', () => {
        testConstraint<string>(
            () => {
                class MyClass {
                    @Max(5)
                    myProperty: string;

                    constructor(myProperty: string) {
                        this.myProperty = myProperty;
                    }
                }
                return MyClass;
            },
            ['!@#$'],
            ['abcdEFG12390'],
        );
    });

    describe('Min', () => {
        testConstraint<string>(
            () => {
                class MyClass {
                    @Min(5)
                    myProperty: string;

                    constructor(myProperty: string) {
                        this.myProperty = myProperty;
                    }
                }
                return MyClass;
            },
            ['abcdEFG12390'],
            ['!@#$'],
        );
    });

    describe('Regex', () => {
        testConstraint<string>(
            () => {
                class MyClass {
                    @Regex(/test/)
                    myProperty: string;

                    constructor(myProperty: string) {
                        this.myProperty = myProperty;
                    }
                }
                return MyClass;
            },
            ['test', 'test123', '123test', '123test123'],
            ['TEST', 'abcd'],
        );
    });

    describe('Replace', () => {
        class MyClass {
            @Replace(/test/g, 'new')
            myProperty: string;

            constructor(myProperty: string) {
                this.myProperty = myProperty;
            }
        }
        testConversion<string>(
            () => MyClass,
            (obj: MyClass) => obj.myProperty,
            [['test', 'new']],
            ['asdf'],
        );

        it('should not modify matching property when convert is false', () => {
            const validator = new Validator({
                convert: false,
            });

            const input = 'test';
            const object = new MyClass(input);

            expect(object).toBeValid({ validator });

            const result = validator.validate(object);
            expect(result).toHaveProperty('value');
            expect(object.myProperty).toEqual(input);
        });
    });

    describe('Token', () => {
        testConstraint<string>(
            () => {
                class MyClass {
                    @Token()
                    myProperty: string;

                    constructor(myProperty: string) {
                        this.myProperty = myProperty;
                    }
                }
                return MyClass;
            },
            ['abcdEFG12390', '_'],
            ['!@#$', ' '],
        );
    });

    describe('Trim', () => {
        describe('without conversion', () => {
            testConstraint<string>(
                () => {
                    class MyClass {
                        @Trim()
                        myProperty: string;

                        constructor(myProperty: string) {
                            this.myProperty = myProperty;
                        }
                    }
                    return MyClass;
                },
                ['abcdEFG12390', '_'],
                [' !@#$', 'abcdEFG12390 ', ' ', 'abcdEFG12390\t', '\nabcdEFG12390', '\r'],
                {
                    convert: false,
                },
            );
        });

        describe('with conversion', () => {
            class MyClass {
                @Trim()
                myProperty: string;

                constructor(myProperty: string) {
                    this.myProperty = myProperty;
                }
            }
            testConversion<string>(
                () => MyClass,
                (obj: MyClass) => obj.myProperty,
                [
                    ['abcdEFG12390', 'abcdEFG12390'],
                    ['_', '_'],
                    [' !@#$', '!@#$'],
                    ['abcdEFG12390 ', 'abcdEFG12390'],
                    //[" ", ""],
                    ['abcdEFG12390\t', 'abcdEFG12390'],
                    ['\nabcdEFG12390', 'abcdEFG12390'],
                    [' moo \r', 'moo'],
                ], [],
            );
        });
    });

    describe('Uppercase', () => {
        class MyClass {
            @Uppercase()
            myProperty: string;

            constructor(myProperty: string) {
                this.myProperty = myProperty;
            }
        }

        describe('without conversion', () => {
            testConstraint<string>(
                () => MyClass,
                ['ABCD!@#'],
                ['abcd123'],
                { convert: false },
            );
        });

        describe('with conversion', () => {
            testConversion<string>(
                () => MyClass,
                (obj: MyClass) => obj.myProperty,
                [['abcd123', 'ABCD123']],
                ['ABCD!@#'],
            );
        });
    });

    describe('Uri', () => {
        describe('no options', () => {
            testConstraint<string>(
                () => {
                    class MyClass {
                        @Uri()
                        myProperty: string;

                        constructor(myProperty: string) {
                            this.myProperty = myProperty;
                        }
                    }
                    return MyClass;
                },
                ['https://my.site.com'],
                ['!@#$', ' '],
            );
        });

        describe('scheme', () => {
            testConstraint<string>(
                () => {
                    class MyClass {
                        @Uri({
                            scheme: 'git',
                        })
                        myProperty: string;

                        constructor(myProperty: string) {
                            this.myProperty = myProperty;
                        }
                    }
                    return MyClass;
                },
                ['git://my.site.com'],
                ['https://my.site.com'],
            );
        });
    });
});
