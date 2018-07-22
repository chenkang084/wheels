var config = require("./config");
var Directives = require("./directives");

function Directive(attr, el) {
  var type = attr.name.slice(config.prefix.length + 1);
  this.type = type;
  this.el = el;
  this.key = attr.value.trim();

  var update = Directives[type];

  if (typeof update === "function") {
    this["_update"] = update;
  } else {
    for (var prop in update) {
      if (prop === "update") {
        this["_update"] = update[prop];
      } else {
        this[prop] = update[prop];
      }
    }
  }
}

module.exports = Directive;
