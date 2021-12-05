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
  show: function(_el) {
    console.log(_el);
    _el.style.display = 'block';
  },
  hide: function(_el) {
    console.log(_el);
    _el.style.display = 'none';
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
  },
  tip: function(_type, time) {
    var me = this;
    var tipContainer = document.createElement('div');
    _Dom.addClass(tipContainer, 'tip-container');
    _Dom.addClass(tipContainer, _type);
    var tip = document.createElement('div');
    _Dom.addClass(tip, 'tip');
    switch (_type) {
      case 'success':
        tip.innerHTML = '<i class="iconfont icon-check-circle"></i><span>保存成功！</span>';
        break;
      case 'del':
        tip.innerHTML = '<i class="iconfont icon-close-circle"></i><span>删除成功！</span>';
        break;
      default:
        break;
    }
    if (time) {
      tip.style = 'animation: tipShow ' + time / 1000 + 's';
    }
    tipContainer.appendChild(tip);
    document.body.appendChild(tipContainer);
    window.setTimeout(function() {
      _Dom.hide(tipContainer);
    }, time);
  }
};
