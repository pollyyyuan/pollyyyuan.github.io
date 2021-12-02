// dom操作
var _Dom = {
  $: function(_el, _parent) {
    if (_el.indexOf('#') > -1) {
      console.log(document.getElementById(_el.substring(1)));
      return document.getElementById(_el.substring(1));
    } else {
      return _parent.querySelectorAll(_el);
    }
  },
  addClass: function(el, className) {
    var newClass = el.className.split(' ');
    var find = newClass.findIndex(function(name) {
      return name === className;
    });

    if (find === -1) {
      newClass.push(className);
      el.className = newClass.join(' ');
    }
  },
  delClass: function(el, className) {
    var newClass = el.className.split(' ');
    var find = newClass.findIndex(function(name) {
      return name === className;
    });

    if (find > -1) {
      newClass.splice(find, 1);
      el.className = newClass.join(' ');
    }
  }
};
