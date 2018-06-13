var config = require('./config');

module.exports = {
  text: function(value) {
    this.el.textContent = value || '';
  },

  show: function(value) {
    this.el.style.display = value ? '' : 'none';
  },

  each: function() {
    console.log('each');
  },
};
