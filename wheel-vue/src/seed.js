var config = require("./config");
var Directive = require("./directive");

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

/**
 * 将dom属性上面，sd-*的属性编译成directive
 * @param {String| DOM} node
 * @param {Boolean} root
 */
Seed.prototype._compileNode = function(node, root) {
  var self = this;

  var attributes = node.attributes;

  // 先渲染自身一层
  if (attributes && attributes.length > 0) {
    // 转换attribute
    [].map
      .call(attributes, function(attr) {
        return {
          name: attr.name,
          value: attr.value
        };
      })

      // 遍历attribute，将attr转换为directive
      .forEach(function(attr) {
        if (!attr.name.match(config.prefix)) return null;

        var directive = new Directive(attr, node);

        // node.removeAttribute(attr.name);
        // if (directive.bind) {
        //   directive.bind(attr, node);
        // }

        if (directive) {
          self._bind(directive);
        }
      });
  }

  // 查找子元素是否存在
  if (node.childNodes && node.childNodes.length > 0) {
    [].forEach.call(node.childNodes, function(node) {
      self._compileNode(node);
    });
  }

  console.log("compile node");
};

/**
 * 指定directive与scope数据的关联关系
 * @param {Directive} directive
 */
Seed.prototype._bind = function(directive) {
  var key = directive.key;

  var binding = (this._bindings[key] =
    this._bindings[key] || this._createBinding(key));

  binding.deps.push(directive);
};

/**
 * 创建bind对象
 * @param {String} key
 */
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
        dep._update(newVal);
      });
    }
  });

  return binding;
};

/**
 * vue 启动程序
 * @param {Object} opts
 */
Seed.bootstrap = function(opts) {
  return new Seed(opts.el, opts.data);
};

module.exports = Seed;
