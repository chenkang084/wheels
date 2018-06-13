var config = require("./config");

var bind = {
  text: function(value) {
    this.el.textContent = value || "";
  }
};

function Directive(attr, el) {
  var type = attr.name.slice(config.prefix.length + 1);
  this.type = type;
  this.el = el;
  this.key = attr.value.trim();

  this.update = bind[type];
}

module.exports = Directive;
