import _Dommer from './Dommer.js';
import { _isType, _toArray, _extend } from './utils.js';
import messages from './messages.js'

const staticMethods = {
  extend: _extend,
  create(elements) {
    return new _Dommer(elements);
  },
  each(iterable, callback) {
    if(!_isType(callback, 'function')) {
      throw new Error('The each method needs to receive a function as callback!');
    }

    _toArray(iterable).forEach((element, index) => callback.apply(element, [index, element]));
  },
  map(iterable, callback) {
    if(!_isType(callback, 'function')) {
      throw new Error('The map method needs to receive a function as callback!');
    }

    return _toArray(iterable)
      .map((element, index) => callback.apply(element, [index, element]))
  },
  filter(iterable, callback) {
    if(!_isType(callback, 'function')) {
      throw new Error('The filter method needs to receive a function as callback!');
    }

    return _toArray(iterable).filter((element, index) => {
      return (!_isType(element, 'undefined')) && callback.apply(element, [index, element])
    });
  },
};

staticMethods.extend(_Dommer, staticMethods);
staticMethods.extend(Dommer, staticMethods);

// Add messages at Class
_Dommer.messages = messages;

// Define Constructor
function Dommer(...args) {
  return new _Dommer(...args);
}

// Create Alias
Dommer.fn = _Dommer.prototype;

export default Dommer;
