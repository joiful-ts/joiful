import * as chai from "chai";
import AssertStatic = Chai.AssertStatic;
var assert : AssertStatic = chai.assert;
import {SCHEMA_KEY} from "../../../src/core";
import {StringSchema} from "../../../src/constraints/string";
import * as Joi from "joi";
import {ConstraintDefinitionError} from "../../../src/core";
import {Length} from "../../../src/constraints/string";
import {Validator} from "../../../src/Validator";
import {Alphanum} from "../../../src/constraints/string";
import {Min} from "../../../src/constraints/string";
import {isValid} from "../testUtil";
import {isInvalid} from "../testUtil";
import {registerJoi} from "../../../src/core";
import {testConstraint} from "../testUtil";
import {CreditCard} from "../../../src/constraints/string";
import {Email} from "../../../src/constraints/string";
import {Guid} from "../../../src/constraints/string";
import {Hex} from "../../../src/constraints/string";
import {Hostname} from "../../../src/constraints/string";
import {Ip} from "../../../src/constraints/string";
import {IsoDate} from "../../../src/constraints/string";
import {Lowercase} from "../../../src/constraints/string";
import {Max} from "../../../src/constraints/string";
import {Replace} from "../../../src/constraints/string";
import {RegexConstraint} from "../../../src/constraints/string";
import {Token} from "../../../src/constraints/string";
import {Trim} from "../../../src/constraints/string";
import {testConversion} from "../testUtil";
import {Uppercase} from "../../../src/constraints/string";
import {Uri} from "../../../src/constraints/string";

registerJoi(Joi);

describe("String constraints", function () {
    describe("StringSchema", function () {
        class MyClass {
            @StringSchema()
            myProperty : string;

            @StringSchema()
            myOtherProperty : String;
        }

        it("should annotate the class property", function () {
            var metadata = Reflect.getMetadata(SCHEMA_KEY, MyClass.prototype);
            var expected = {
                myProperty: Joi.string(),
                myOtherProperty: Joi.string()
            };
            assert.deepEqual(metadata, expected);
        });

        it("should error when applied to a non-string property", function () {
            assert.throws(function () {
                class MyBadClass {
                    @StringSchema()
                    myBadProperty : number;
                }
            }, ConstraintDefinitionError);
        });
    });

    describe("Length, and core functionality", function () {
        it("should annotate the class property", function () {
            class MyClass {
                @Length(5)
                @StringSchema()
                myProperty : string;
            }

            var metadata = Reflect.getMetadata(SCHEMA_KEY, MyClass.prototype);
            var expected : any = {
                myProperty: Joi.string().length(5)
            };
            assert.equal(JSON.stringify(metadata), JSON.stringify(expected));
        });

        it("should validate successful candidates", function () {
            class MyClass {
                @Length(5)
                @StringSchema()
                myProperty : string;
            }

            var object = new MyClass();
            object.myProperty = "abcde";
            var validator = new Validator();
            isValid(validator, object);
        });

        it("should validate failing candidates", function () {
            class MyClass {
                @Length(5)
                @StringSchema()
                myProperty : string;
            }

            var object = new MyClass();
            object.myProperty = "abc";
            var validator = new Validator();
            isInvalid(validator, object);
        });

        it("should validate successful candidate created from object literal", function () {
            class MyClass {
                @Length(5)
                @StringSchema()
                myProperty : string;
            }

            var object = {
                myProperty: "abcde"
            };
            var validator = new Validator();
            var result = validator.validateAsClass(object, MyClass);
            //console.log(result);
            assert.property(result, "error");
            assert.isNull(result.error);
        });

        it("should validate failing candidate created from object literal", function () {
            class MyClass {
                @Length(5)
                @StringSchema()
                myProperty : string;
            }

            var object = {
                myProperty: "abc"
            };
            var validator = new Validator();
            var result = validator.validateAsClass(object, MyClass);
            //console.log(result);
            assert.property(result, "error");
            assert.isNotNull(result.error);
        });

        it("should create Joi type schema derived from property type, if no type schema specified", function () {
            class MyClass {
                @Length(5)
                myProperty : string;
            }

            let object = new MyClass();
            object.myProperty = "abcde";
            const validator = new Validator();
            isValid(validator, object);
        });
    });

    describe("Alphanum", function () {
        testConstraint<string>(() => {
                class MyClass {
                    @Alphanum()
                    myProperty:string;

                    constructor(myProperty:string) {
                        this.myProperty = myProperty;
                    }
                }
                return MyClass;
            },
            ["abcdEFG12390"],
            ["!@#$"]
        );
    });

    describe("CreditCard", function () {
        testConstraint<string>(() => {
                class MyClass {
                    @CreditCard()
                    myProperty : string;

                    constructor(myProperty:string) {
                        this.myProperty = myProperty;
                    }
                }
                return MyClass;
            },
            ["4444333322221111"],
            ["abcd", "1234", "4444-3333-2222-1111"]
        );
    });

    describe("Email", function () {
        testConstraint<string>(() => {
                class MyClass {
                    @Email()
                    myProperty : string;

                    constructor(myProperty:string) {
                        this.myProperty = myProperty;
                    }
                }
                return MyClass;
            },
            ["monkey@see.com", "monkey@do", "howdy+there@pardner.co.kr"],
            ["123.com"]
        );
    });

    describe("Guid", function () {
        testConstraint<string>(() => {
                class MyClass {
                    @Guid()
                    myProperty : string;

                    constructor(myProperty:string) {
                        this.myProperty = myProperty;
                    }
                }
                return MyClass;
            },
            ["3F2504E0-4F89-41D3-9A0C-0305E82C3301", "3f2504e0-4f89-41d3-9a0c-0305e82c3301"],
            ["123", "abc"]
        );
    });

    describe("Hex", function () {
        testConstraint<string>(() => {
                class MyClass {
                    @Hex()
                    myProperty : string;

                    constructor(myProperty:string) {
                        this.myProperty = myProperty;
                    }
                }
                return MyClass;
            },
            ["AB", "0123456789abcdef", "0123456789ABCDEF", "123", "FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF"],
            ["0xf", "0x0F", "0xAB", "A B", "jj"]
        );
    });

    describe("Hostname", function () {
        testConstraint<string>(() => {
                class MyClass {
                    @Hostname()
                    myProperty : string;

                    constructor(myProperty:string) {
                        this.myProperty = myProperty;
                    }
                }
                return MyClass;
            },
            ["www.thisisnotarealdomainnameoratleastihopeitsnot.com.au", "www.zxcv.ninja", "127.0.0.1"],
            ["https://www.thisisnotarealdomainnameoratleastihopeitsnot.com.au", "www.zxcv.ninja/hello", "www.zxcv.ninja?query=meow"]
        );
    });

    describe("Ip", function () {
        describe("no options", () => {
            testConstraint<string>(() => {
                    class MyClass {
                        @Ip()
                        myProperty : string;

                        constructor(myProperty:string) {
                            this.myProperty = myProperty;
                        }
                    }
                    return MyClass;
                },
                ["127.0.0.1", "127.0.0.1/24", "2001:0db8:0000:0000:0000:ff00:0042:8329"],
                ["abc.def.ghi.jkl", "123"]
            );
        });

        describe("IPv4", () => {
            testConstraint<string>(() => {
                    class MyClass {
                        @Ip({
                            version: 'ipv4'
                        })
                        myProperty : string;

                        constructor(myProperty:string) {
                            this.myProperty = myProperty;
                        }
                    }
                    return MyClass;
                },
                ["127.0.0.1", "127.0.0.1/24"],
                ["2001:0db8:0000:0000:0000:ff00:0042:8329"]
            );
        });

        describe("IPv6", () => {
            testConstraint<string>(() => {
                    class MyClass {
                        @Ip({
                            version: 'ipv6'
                        })
                        myProperty : string;

                        constructor(myProperty:string) {
                            this.myProperty = myProperty;
                        }
                    }
                    return MyClass;
                },
                ["2001:0db8:0000:0000:0000:ff00:0042:8329", "2001:db8:0:0:0:ff00:42:8329", "2001:db8::ff00:42:8329", "::1"],
                ["127.0.0.1", "127.0.0.1/24"]
            );
        });

        describe("CIDR required", () => {
            testConstraint<string>(() => {
                    class MyClass {
                        @Ip({
                            cidr: "required"
                        })
                        myProperty : string;

                        constructor(myProperty:string) {
                            this.myProperty = myProperty;
                        }
                    }
                    return MyClass;
                },
                ["127.0.0.1/24", /*"2001:db8:abcd:8000::/50"*/], // bug in Joi? doesn't like IPv6 CIDR
                ["127.0.0.1", "2001:0db8:0000:0000:0000:ff00:0042:8329", "2001:db8:abcd:8000::/50"]
            );
        });
    });

    describe("IsoDate", function () {
        testConstraint<string>(() => {
                class MyClass {
                    @IsoDate()
                    myProperty : string;

                    constructor(myProperty:string) {
                        this.myProperty = myProperty;
                    }
                }
                return MyClass;
            },
            ["2016-05-20", "2016-05-20T23:09:53+00:00", "2016-05-20T23:09:53Z", "2016-05-20T23:09:53", /*"20160520T230953Z"*/],
            ["20-05-2016", "23:09:53", "abcd", String(new Date().valueOf())]
        );
    });

    describe("Lowercase", function () {
        class MyClass {
            @Lowercase()
            myProperty : string;

            constructor(myProperty:string) {
                this.myProperty = myProperty;
            }
        }

        describe("without conversion", () => {
            testConstraint<string>(
                () => MyClass,
                ["abcd123"],
                ["ABCD!@#"],
                {
                    convert: false
                }
            );
        });

        describe("with conversion", () => {
            testConversion<string>(
                () => MyClass,
                (obj : MyClass) => obj.myProperty,
                [
                    ["ABCD123", "abcd123"],
                ],
                ["abcd!@#"]
            );
        });
    });

    describe("Max", function () {
        testConstraint<string>(() => {
                class MyClass {
                    @Max(5)
                    myProperty : string;

                    constructor(myProperty : string) {
                        this.myProperty = myProperty;
                    }
                }
                return MyClass;
            },
            ["!@#$"],
            ["abcdEFG12390"]
        );
    });

    describe("Min", function () {
        testConstraint<string>(() => {
                class MyClass {
                    @Min(5)
                    myProperty : string;

                    constructor(myProperty : string) {
                        this.myProperty = myProperty;
                    }
                }
                return MyClass;
            },
            ["abcdEFG12390"],
            ["!@#$"]
        );
    });

    describe("Regex", function () {
        testConstraint<string>(() => {
                class MyClass {
                    @RegexConstraint(/test/g)
                    myProperty : string;

                    constructor(myProperty : string) {
                        this.myProperty = myProperty;
                    }
                }
                return MyClass;
            },
            ["test123", "123test", "123test123"],
            ["abcd", "TEST"]
        );
    });

    describe("Replace", function () {
        class MyClass {
            @Replace(/test/g, "new")
            myProperty : string;

            constructor(myProperty : string) {
                this.myProperty = myProperty;
            }
        }
        testConversion<string>(
            () => MyClass,
            (obj : MyClass) => obj.myProperty,
            [
                ["test", "new"]
            ], [
                "asdf"
            ]
        );

        it("should not modify matching property when convert is false", () => {
            const validator = new Validator({
                convert: false
            });

            const input = "test";
            const object = new MyClass(input);
            const result = validator.validate(object);
            assert.property(result, "error");
            assert.isNull(result.error, "Validation should pass");
            assert.property(result, "value");
            const value = result.value;
            assert.equal(object.myProperty, input);
        });
    });

    describe("Token", function () {
        testConstraint<string>(() => {
                class MyClass {
                    @Token()
                    myProperty : string;

                    constructor(myProperty : string) {
                        this.myProperty = myProperty;
                    }
                }
                return MyClass;
            },
            ["abcdEFG12390", "_"],
            ["!@#$", " "]
        );
    });

    describe("Trim", function () {
        describe("without conversion", () => {
            testConstraint<string>(() => {
                    class MyClass {
                        @Trim()
                        myProperty : string;

                        constructor(myProperty : string) {
                            this.myProperty = myProperty;
                        }
                    }
                    return MyClass;
                },
                ["abcdEFG12390", "_"],
                [" !@#$", "abcdEFG12390 ", " ", "abcdEFG12390\t", "\nabcdEFG12390", "\r"],
                {
                    convert: false
                }
            );
        });

        describe("with conversion", () => {
            class MyClass {
                @Trim()
                myProperty : string;

                constructor(myProperty : string) {
                    this.myProperty = myProperty;
                }
            }
            testConversion<string>(
                () => MyClass,
                (obj : MyClass) => obj.myProperty,
                [
                    ["abcdEFG12390", "abcdEFG12390"],
                    ["_", "_"],
                    [" !@#$", "!@#$"],
                    ["abcdEFG12390 ", "abcdEFG12390"],
                    //[" ", ""],
                    ["abcdEFG12390\t", "abcdEFG12390"],
                    ["\nabcdEFG12390", "abcdEFG12390"],
                    [" moo \r", "moo"]
                ], []
            );
        });
    });

    describe("Uppercase", function () {
        class MyClass {
            @Uppercase()
            myProperty : string;

            constructor(myProperty:string) {
                this.myProperty = myProperty;
            }
        }

        describe("without conversion", () => {
            testConstraint<string>(
                () => MyClass,
                ["ABCD!@#"],
                ["abcd123"],
                {
                    convert: false
                }
            );
        });

        describe("with conversion", () => {
            testConversion<string>(
                () => MyClass,
                (obj : MyClass) => obj.myProperty,
                [
                    ["abcd123", "ABCD123"],
                ],
                ["ABCD!@#"]
            );
        });
    });

    describe("Uri", function () {
        describe("no options", () => {
            testConstraint<string>(() => {
                    class MyClass {
                        @Uri()
                        myProperty : string;

                        constructor(myProperty : string) {
                            this.myProperty = myProperty;
                        }
                    }
                    return MyClass;
                },
                ["https://my.site.com"],
                ["!@#$", " "]
            );
        });

        describe("scheme", () => {
            testConstraint<string>(() => {
                    class MyClass {
                        @Uri({
                            scheme: 'git'
                        })
                        myProperty : string;

                        constructor(myProperty : string) {
                            this.myProperty = myProperty;
                        }
                    }
                    return MyClass;
                },
                ["git://my.site.com"],
                ["https://my.site.com"]
            );
        });
    });
});
