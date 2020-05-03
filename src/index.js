import { _hasMatch, _isType } from './utils.js';

const messages = {
  SELECTOR_EMPTY: () => 'Please inform a selector!',
  INDEX_NOT_EXIST: index => `The informed index (${index}) don\'t exist`,
};

class Dom {
  constructor(selector) {
    if(_isType(selector, 'string')) {
      return this.find(selector, context);
    }

    // handle HTMLElements, Nodelist and HTMLCollection
    this.elements = selector.length !== undefined
      ? Array.from(selector)
      : [selector];
  }

  static create(elements) {
    return new Dom(elements);
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
    return Dom.create(_elements);
  }

  attr(key, value) {
    if (value !== undefined) {
      this.elements.forEach(element => element.setAttribute(key, value));
      return this;
    }

    return this.elements[0].getAttribute(key);
  }

  hasAttr(key) {
    return this.elements[0].hasAttribute(key);
  }

  hasClass(className) {
    return this.elements[0].classList.contains(className);
  }

  removeClass(...classNames) {
    this.elements.forEach(element => element.classList.remove(...classNames));

    return this;
  }

  addClass(...classNames) {
    this.elements.forEach(element => element.classList.add(...classNames));

    return this;
  }

  toggleClass(...classNames) {
    this.elements.forEach(element => {
      classNames.forEach(className => element.classList.toggle(className));
    });

    return this;
  }

  eq(index) {
    const elementsLength = this.elements.length;
    const targetIndex = index < 0 ? (elementsLength) + (index) : index;

    if(targetIndex < 0 || targetIndex > elementsLength) {
      throw new Error(messages.INDEX_NOT_EXIST(index));
    }

    return Dom.create(this.elements[targetIndex]);
  }

  get(index) {
    return this.elements[index];
  }

  first() {
    return this.eq(0);
  }

  last() {
    return this.eq(this.elements.length - 1);
  }

  filter(query) {
    return Dom.create(this.elements.filter((element, index, array) => {
      return _isType(query, 'function')
        ? query(element, index, array)
        : _hasMatch(element, query);
    }));
  }
}

// Add messages at Class
Dom.messages = messages;

export default Dom;
