var config = require("./config");
var Directives = require("./directives");

var KEY_RE = /^[^\|]+/,
  ARG_RE = /([^:]+):(.+)$/,
  FILTERS_RE = /\|[^\|]+/g,
  FILTER_TOKEN_RE = /[^\s']+|'[^']+'/g,
  QUOTE_RE = /'/g;

function Binding(dirname, expression) {
  var directive = Directives[dirname];
  if (typeof directive === "function") {
    this["_update"] = directive;
  } else {
    for (var prop in directive) {
      if (prop === "update") {
        this["_update"] = directive.update;
      } else {
        this[prop] = directive[prop];
      }
    }
  }

  var rawKey = expression.match(KEY_RE)[0],
    argMatch = rawKey.match(ARG_RE);

  this.key = argMatch ? argMatch[2].trim() : rawKey.trim();
  this.arg = argMatch ? argMatch[1].trim() : null;

  var filterExpressions = expression.match(FILTERS_RE);
  if (filterExpressions) {
    this.filters = filterExpressions.map(function(filter) {
      var token = filter
        .slice(1)
        .match(FILTER_TOKEN_RE)
        .map(function(token) {
          return token.replace(QUOTE_RE, "").trim();
        });
    });

    return {
      name: token[0],
      apply: filters[tokens[0]],
      args: tokens.length > 1 ? tokens.slice(1) : null
    };
  } else {
    this.filters = null;
  }
}

Binding.prototype.update = function(value) {
  if (this.filters) {
    value = this.applyFilters(value);
  }

  this._update(value);
};

Binding.prototype.applyFilters = function(value) {
  var filtered = value;
  this.filters.forEach(function(filter) {
    if (!filter.apply) throw new Error("Unkown filter:" + filter.name);
    filtered = filter.apply(filtered, filter.args);
  });
};

module.exports = {
  parse: function(dirname, expression) {
    var prefix = config.prefix;

    if (dirname.indexOf(prefix) === -1) return null;

    dirname = dirname.slice(prefix.length + 1);
    var dir = Directives[dirname],
      valid = KEY_RE.test(expression);

    if (!dir) console.warn("unknown directive: " + dirname);
    if (!valid) console.warn("invalid directive expression: " + expression);

    return dir && valid ? new Binding(dirname, expression) : null;
  }
};
