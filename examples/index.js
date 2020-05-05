import Dommer from '../src/index.js';

const $divTag = Dommer('div.tag');

const $divTagChildren = $divTag.children();

console.log(
  $divTagChildren.map(element => Dommer(element).attr('data-label')).get().join()
);

