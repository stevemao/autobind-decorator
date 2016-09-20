'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

var _createDecoratedClass = (function () { function defineProperties(target, descriptors, initializers) { for (var i = 0; i < descriptors.length; i++) { var descriptor = descriptors[i]; var decorators = descriptor.decorators; var key = descriptor.key; delete descriptor.key; delete descriptor.decorators; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor || descriptor.initializer) descriptor.writable = true; if (decorators) { for (var f = 0; f < decorators.length; f++) { var decorator = decorators[f]; if (typeof decorator === 'function') { descriptor = decorator(target, key, descriptor) || descriptor; } else { throw new TypeError('The decorator for method ' + descriptor.key + ' is of the invalid type ' + typeof decorator); } } if (descriptor.initializer !== undefined) { initializers[key] = descriptor; continue; } } Object.defineProperty(target, key, descriptor); } } return function (Constructor, protoProps, staticProps, protoInitializers, staticInitializers) { if (protoProps) defineProperties(Constructor.prototype, protoProps, protoInitializers); if (staticProps) defineProperties(Constructor, staticProps, staticInitializers); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

require('core-js/modules/es6.reflect');

require('core-js/modules/es6.symbol');

var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

var _ = require('../');

var _2 = _interopRequireDefault(_);

describe('autobind method decorator', function () {
  var A = (function () {
    function A() {
      _classCallCheck(this, A);

      this.value = 42;
    }

    _createDecoratedClass(A, [{
      key: 'getValue',
      decorators: [_2['default']],
      value: function getValue() {
        return this.value;
      }
    }]);

    return A;
  })();

  it('binds methods to an instance', function () {
    var a = new A();
    var getValue = a.getValue;
    (0, _assert2['default'])(getValue() === 42);
  });

  it('binds method only once', function () {
    var a = new A();
    (0, _assert2['default'])(a.getValue === a.getValue);
  });

  /** parse errors. Submitted issue to babel #1238
  it('binds methods with symbols as keys', function () {
    var symbol = Symbol('method');
    class A {
      constructor () {
        this.val = 42;
      }
      @autobind
      [symbol] () {
        return this.val;
      }
    }
    let a = new A();
    let getValue = a[symbol];
    assert(getValue() === 42);
  });
  */

  it('throws if applied on a method of more than zero arguments', function () {
    _assert2['default'].throws(function () {
      var A = (function () {
        function A() {
          _classCallCheck(this, A);
        }

        _createDecoratedClass(A, [{
          key: 'value',
          decorators: [_2['default']],
          get: function get() {
            return 1;
          }
        }]);

        return A;
      })();
    }, /@autobind decorator can only be applied to methods/);
  });

  it('should not override binded instance method, while calling super method with the same name', function () {
    // eslint-disable-line max-len

    var B = (function (_A) {
      _inherits(B, _A);

      function B() {
        _classCallCheck(this, B);

        _get(Object.getPrototypeOf(B.prototype), 'constructor', this).apply(this, arguments);
      }

      _createDecoratedClass(B, [{
        key: 'getValue',
        decorators: [_2['default']],
        value: function getValue() {
          return _get(Object.getPrototypeOf(B.prototype), 'getValue', this).call(this) + 8;
        }
      }]);

      return B;
    })(A);

    var b = new B();
    var value = b.getValue();
    value = b.getValue();

    (0, _assert2['default'])(value === 50);
  });
});

describe('autobind class decorator', function () {

  var symbol = Symbol('getValue');

  var A = (function () {
    function A() {
      _classCallCheck(this, _A2);

      this.value = 42;
    }

    _createClass(A, [{
      key: 'getValue',
      value: function getValue() {
        return this.value;
      }
    }, {
      key: symbol,
      value: function value() {
        return this.value;
      }
    }]);

    var _A2 = A;
    A = (0, _2['default'])(A) || A;
    return A;
  })();

  it('binds methods to an instance', function () {
    var a = new A();
    var getValue = a.getValue;
    (0, _assert2['default'])(getValue() === 42);
  });

  it('binds method only once', function () {
    var a = new A();
    (0, _assert2['default'])(a.getValue === a.getValue);
  });

  it('ignores non method values', function () {
    _assert2['default'].doesNotThrow(function () {
      var A = (function () {
        function A() {
          _classCallCheck(this, _A3);
        }

        _createClass(A, [{
          key: 'value',
          // eslint-disable-line no-unused-vars
          get: function get() {
            return 1;
          }
        }]);

        var _A3 = A;
        A = (0, _2['default'])(A) || A;
        return A;
      })();
    });
  });

  it('does not override itself when accessed on the prototype', function () {
    A.prototype.getValue; // eslint-disable-line no-unused-expressions

    var a = new A();
    var getValue = a.getValue;
    (0, _assert2['default'])(getValue() === 42);
  });

  describe('with Reflect', function () {
    describe('with Symbols', function () {
      it('binds methods with symbol keys', function () {
        var a = new A();
        var getValue = a[symbol];
        (0, _assert2['default'])(getValue() === 42);
      });
    });
  });

  describe('without Reflect', function () {
    // remove Reflect pollyfill
    var _Reflect = Reflect;
    var A = undefined;

    before(function () {
      Reflect = undefined;

      var B = (function () {
        function B() {
          _classCallCheck(this, _B);

          this.value = 42;
        }

        _createClass(B, [{
          key: 'getValue',
          value: function getValue() {
            return this.value;
          }
        }, {
          key: symbol,
          value: function value() {
            return this.value;
          }
        }]);

        var _B = B;
        B = (0, _2['default'])(B) || B;
        return B;
      })();

      A = B;
    });

    after(function () {
      Reflect = _Reflect;
    });

    it('falls back to Object.getOwnPropertyNames', function () {
      var a = new A();
      var getValue = a.getValue;
      (0, _assert2['default'])(getValue() === 42);
    });

    describe('with Symbols', function () {
      it('falls back to Object.getOwnPropertySymbols', function () {
        var a = new A();
        var getValue = a[symbol];
        (0, _assert2['default'])(getValue() === 42);
      });
    });

    describe('without Symbols', function () {
      var _Symbol = Symbol;
      var _getOwnPropertySymbols = Object.getOwnPropertySymbols;
      var A = undefined;

      before(function () {
        Symbol = undefined;
        Object.getOwnPropertySymbols = undefined;

        var B = (function () {
          function B() {
            _classCallCheck(this, _B2);

            this.value = 42;
          }

          _createClass(B, [{
            key: 'getValue',
            value: function getValue() {
              return this.value;
            }
          }]);

          var _B2 = B;
          B = (0, _2['default'])(B) || B;
          return B;
        })();

        A = B;
      });

      after(function () {
        Symbol = _Symbol;
        Object.getOwnPropertySymbols = _getOwnPropertySymbols;
      });

      it('does throws no error if Symbol is not supported', function () {
        var a = new A();
        var getValue = a.getValue;
        (0, _assert2['default'])(getValue() === 42);
      });
    });
  });
});
// eslint-disable-line no-unused-vars
