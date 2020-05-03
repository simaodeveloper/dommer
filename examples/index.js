import Dom from '../src/index.js';

const $el = new Dom(document.querySelector('ul'));

const $anchors = $el.find('a')


console.time('perf')
console.log(
  $anchors.filter('.tag')
  );
console.timeEnd('perf')

// console.log($el.find('[data-label="link3.2.3"]'));


