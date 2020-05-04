const regex = {
  CLASSNAME: () => /\.\w+\b/g,
  ID: () => /\#\w+\b/g,
  ATTRIBUTE: () => /\[[^\[\]]+\]/g
};

const _has = (regex, callback) => (element, query) => {
  let match = query.match(regex)
  return match && match.every(queryFilter => callback(queryFilter, element));
};

const _hasClass = _has(
  regex.CLASSNAME(),
  (className, element) => element.className.includes(className.replace('.', ''))
);

const _hasId = _has(
  regex.ID(),
  (id, element) => element.id.includes(id.replace('#', ''))
);

const _hasAttribute = _has(
  regex.ATTRIBUTE(),
  (attribute, element) => element.hasAttribute(attribute.replace(/\[|\]/g, '').split('=')[0])
);

const _hasMatch = (element, query) => {
  return _hasId(element, query)
    || _hasClass(element, query)
    || _hasAttribute(element, query);
}

const _toString = target => Object.prototype.toString.call(target)

const _isType = (target, type) =>
  _toString(target) === `[object ${type[0].toUpperCase()}${type.slice(1).toLowerCase()}]`

const _isFunctionSelector = query => element => _hasMatch(element, query);

const _isFunctionCallback = query => (element, index) => query.apply(element, [index, element]);

const _isFunctionElement = query => element => element === query;

const _isFunctionStrategy = (query) => {
  return _isType(query, 'string')
    ? _isFunctionSelector(query)
    : _isType(query, 'function')
      ? _isFunctionCallback(query)
      : _isFunctionElement(query)
}

export {
  _hasMatch,
  _isType,
  _isFunctionStrategy
};
