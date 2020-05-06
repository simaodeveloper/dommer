import Dommer from '../src/index.js';

// const $divTag = Dommer('div.tag');

// const $divTagChildren = $divTag.children();

// console.log(
//   $divTagChildren.map((index, element) => {
//     return Dommer(element).attr('data-label');
//   }).get().join()
// );

console.time('perf');
console.log(Dommer('ul').find('a'))
console.timeEnd('perf');
