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
  },
  // 格式化日期
  formatDate: function(date, format) {
    date = new Date(date);
    format = format || 'yyyy-MM-dd';
    var pad = function(n) {
      return n < 10 ? '0' + n : n;
    };
    return format
      .replace('yyyy', date.getFullYear().toString())
      .replace('MM', pad(date.getMonth() + 1))
      .replace('dd', pad(date.getDate()))
      .replace('HH', pad(date.getHours()))
      .replace('mm', pad(date.getMinutes()))
      .replace('ss', pad(date.getSeconds()));
  },
  // 计算日期
  calDate: function(date, days, format) {
    date = new Date(date);
    var finalDate = date;
    finalDate.setDate(finalDate.getDate() + days);
    return this.formatDate(finalDate, format);
  },
  vibrate: function() {
    if ('vibrate' in window.navigator) {
      window.navigator.vibrate([200, 100, 200]);
    } else {}
  }
};
