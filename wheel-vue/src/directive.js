var config = require('./config');
var Directives = require('./directives');

function Directive(attr, el) {
  var type = attr.name.slice(config.prefix.length + 1);
  this.type = type;
  this.el = el;
  this.key = attr.value.trim();

  this.update = Directives[type];
}

module.exports = Directive;
