var config = require("./config");

module.exports = {
  text: function(value) {
    this.el.textContent = value || "";
  },

  show: function(value) {
    this.el.style.display = value ? "" : "none";
  },

  each: {
    update: function(dataArray) {
      console.log("update");
      var node = this.el.cloneNode(true);
      this.container = this.el.parentElement;
      if (dataArray && dataArray.length) {
        dataArray.forEach(item => {
          console.log(item);
          new Seed(node, item);
        });
      }

      this.container.insertBefore(node,this.container.firstElementChild)
    },
    bind: function(node) {
      console.log("bind");
    },
    buildItem: function() {
      console.log("builditem");
    }
  }
};
