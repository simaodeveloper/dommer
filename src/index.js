import { _hasMatch, _isType, _isFunctionStrategy } from './utils.js';

const messages = {
  SELECTOR_EMPTY: () => 'Please inform a selector!',
  INDEX_NOT_EXIST: index => `The informed index (${index}) isn\'t valid!`,
};

class _Dommer {
  constructor(selector) {
    if(_isType(selector, 'string')) {
      return this.find(selector);
    }

    // handle HTMLElements, Nodelist and HTMLCollection
    this.elements = _isType(selector.length, 'undefined')
      ? [selector]
      : Array.from(selector);
  }

  find(selector, context = document) {
    let _context = null;
    let _elements = null;

    if (!selector) throw new Error(messages.SELECTOR_EMPTY());

    // Get context and transform into an array
    _context = Array.from(this.elements || [context]);

    // Iterante through context list and fetch all decendents of each context
    _elements = _context.map(ctx => Array.from(ctx.querySelectorAll(selector)));
    // flat all subarray to root level
    _elements = _elements.flat(Infinity);

    // return a new object to represent the element's list
    return _Dommer.create(_elements);
  }

  toString() {
    return '[object _Dommer]';
  }

  // Attribute Methods

  attr(key, value) {
    return _isType(value, 'undefined')
      ? this.get(0).getAttribute(key)
      : this.each(function() {
          this.setAttribute(key, value);
        });
  }

  hasAttr(key) {
    return this.get(0).hasAttribute(key);
  }

  hasClass(className) {
    return this.get(0).classList.contains(className);
  }

  removeClass(...classNames) {
    return this.each(function() {
      this.classList.remove(...classNames);
    });
  }

  addClass(...classNames) {
    return this.each(function() {
      this.classList.add(...classNames);
    });
  }

  toggleClass(...classNames) {
    return this.each(function() {
      _Dommer.each(classNames, (index, className) => this.classList.toggle(className))
    })
  }

  // Miscellaneous - DOM Elements Methods

  get(index) {
    return _isType(index, 'undefined') ? [...this.elements] : this.elements[index];
  }

  index(query) {
    return _isType(query, 'string')
      ? this.elements.reduce((targetIndex, element, index) => {
          targetIndex = _hasMatch(element, query) ? index : targetIndex;
          return targetIndex;
        }, null)
      : this.elements.indexOf(query)
  }

  toArray() {
    return [...this.elements];
  }

  each(callback) {
    _Dommer.each(this.elements, (index, element) => {
      callback.apply(element, [index, element])
    });

    return this;
  }

  // Traversing

  eq(index) {
    const elementsLength = this.elements.length;
    const targetIndex = index < 0 ? (elementsLength) + (index) : index;

    if(targetIndex < 0 || targetIndex > elementsLength) {
      throw new Error(messages.INDEX_NOT_EXIST(index));
    }

    return _Dommer.create(this.elements[targetIndex]);
  }

  first() {
    return this.eq(0);
  }

  last() {
    return this.eq(this.elements.length - 1);
  }

  filter(query) {
    return Dom.create(
      this.elements.filter((element, index) =>
        _isType(query, 'function') ? query.apply(element, [index, element]) : _hasMatch(element, query)
      )
    );
  }

  text(text) {
    if (_isType(text, 'undefined')) {
      return this.elements[0].textContent;
    }

    return this.each(function() {
      this.textContent = text
    });
  }

  html(htmlString) {
    if (_isType(htmlString, 'undefined')) {
      return this.elements[0].innerHTML;
    }

    return this.each(function() {
      this.innerHTML = htmlString
    });
  }

  is(query) {
    return this.elements.every(_isFunctionStrategy(query));
  }

  hide(options) {
    const { display } = {
      display: 'none',
      options
    };

    return this.each(function() {
      this.style.display = display;
    });
  }

  show(options) {
    const { display } = {
      display: 'block',
      options
    };

    return this.each(function() {
      this.style.display = display;
    });
  }

  map(callback) {
    if(!_isType(callback, 'function')) {
      throw new Error('The map method needs to receive a function as callback!');
    }

    return _Dommer.create(this.elements.map(callback))
  }

  children() {
    return _Dommer.create(
      this.elements
        .map(element => Array.from(element.children))
        .flat(Infinity)
    )
  }

  clone(deep) {
    return _Dommer.create(
      this.elements
        .map(element => element.cloneNode(_isType(deep, 'boolean') && deep))
    );
  }

  closest() {}
}

const staticMethods = {
  create(elements) {
    return new _Dommer(elements);
  },
  each(arrayLike, callback) {
    if(!_isType(callback, 'function')) {
      throw new Error('The each method needs to receive a function as callback!');
    }

    Array.from(arrayLike).forEach((element, index) => callback.apply(element, [index, element]))
  },
  extend(...objects) {
    const [target, ...origins] = objects;

    origins.forEach(origin => {
      for (const prop in origin) {
        target[prop] = origin[prop];
      }
    });

    return target;
  }
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

