'use strict';

const _ = require('underscore');

const promises = require('./promises');
const Html = require('./html');

exports.imgElement = imgElement;

function imgElement(func) {
  return function(element) {
    return promises.when(func(element)).then(function(result) {
      const attributes = _.clone(result);
      if (element.altText) {
        // our editor doesn't support alt attributes on images
        // and this text would need to be escaped in some way.
        // so, we're just not including the alt text for now.
        // attributes.alt = element.altText;
      }
      return [ Html.freshElement('img', attributes) ];
    });
  };
}

// Undocumented, but retained for backwards-compatibility with 0.3.x
exports.inline = exports.imgElement;

exports.dataUri = imgElement(function(element) {
  return element.read('base64').then(function(imageBuffer) {
    return {
      src: 'data:' + element.contentType + ';base64,' + imageBuffer,
    };
  });
});
