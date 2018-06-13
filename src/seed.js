var config = require("./config");
var Directive = require("./directive");

var crtlAttr, eachAttr;

function Seed(el, data, options) {
  console.log("seed");

  if (typeof el === "string") {
    el = document.querySelector(el);
  }

  this.el = el;
  this.scope = data;
  this._bindings = {};
  this._options = options || {};

  var key,
    dataCopy = {};

  for (key in data) {
    dataCopy[key] = data[key];
  }

  this._compileNode(this.el);

  // controller 相关逻辑

  // 调用set方法 update页面
  for (key in dataCopy) {
    this.scope[key] = dataCopy[key];
  }
}

Seed.prototype._compileNode = function(node, root) {
  var self = this;

  var attributes = node.attributes;

  if (attributes && attributes.length > 0) {
    [].map
      .call(attributes, function(attr) {
        return {
          name: attr.name,
          value: attr.value
        };
      })
      .forEach(function(attr) {
        console.log(attr);

        if (!attr.name.match(config.prefix)) return null;

        var directive = new Directive(attr, node);

        if (directive) {
          self._bind(directive);
        }
      });
  }

  // if (node.) {
    
  // }

  console.log("compile node");
};

Seed.prototype._bind = function(directive) {
  var key = directive.key;

  var binding = (this._bindings[key] =
    this._bindings[key] || this._createBinding(key));

  binding.deps.push(directive);
};

Seed.prototype._createBinding = function(key) {
  var binding = {
    deps: [],
    value: this.scope[key]
  };

  Object.defineProperty(this.scope, key, {
    get: function() {
      return binding.value;
    },
    set: function(newVal) {
      binding.value = newVal;

      binding.deps.forEach(function(dep) {
        dep.update(newVal);
      });
    }
  });

  return binding;
};

Seed.bootstrap = function(opts) {
  return new Seed(opts.el, opts.data);
};

module.exports = Seed;
