// 编辑
var Edit = (function() {
  function Edit() {
    this.today = this.formatDate(new Date());
  }
  Edit.prototype = {
    // 初始化
    init: function(home, editPopup) {
      this.home = home;
      this._editPopup = editPopup;

      //绑定DOM
      this.bindDom();
      // 绑定事件
      this.bindEvent();
      // 初始化数据
      this.date = this.today;
      this.setDateShow();
      this.currentTab = '交通';
      this.switchTab();
    },
    searchData: function(name) {

    },
    //绑定DOM
    bindDom: function() {
      this._editPage = _Dom.$('#editPage');
      this._editCloseBtn = _Dom.$('#editCloseBtn');
      this._editSaveBtn = _Dom.$('#editSaveBtn');

      // 日期
      this._editDate = {
        left: _Dom.$('#editSwitchDate1'),
        right: _Dom.$('#editSwitchDate2'),
        value: _Dom.$('#editDate')
      };

      this._work = _Dom.$('#editWork'); // 事务

      this._editTabGroup = _Dom.$('#editTabGroup');
      this._editTabs = _Dom.$('.tab', this._editTabGroup);

      this._editCardContainer = _Dom.$('#editCardContainer');
      this._editCards = {
        traffic: _Dom.$('.traffic-card', this._editCardContainer),
        stay: _Dom.$('.stay-card', this._editCardContainer),
        cost: _Dom.$('.cost-card', this._editCardContainer)
      };
    },
    //绑定事件
    bindEvent: function() {
      var me = this;
      this._editCloseBtn.addEventListener('click', function() {
        _Dom.delClass(me._editPopup, 'show');
        window.setTimeout(function() {
          me._editPopup.style.display = 'none';
        }, 300);
      });
      this._editDate.left.addEventListener('click', function() {
        me.switchDate('left');
      });
      this._editDate.right.addEventListener('click', function() {
        me.switchDate('right');
      });
      for (var i = 0; i < this._editTabs.length; i++) {
        this._editTabs[i].addEventListener('click', function(_el) {
          me.currentTab = _el.target.innerHTML;
          console.log(_el);
          me.switchTab();
        });
      }

    },
    // 日期 START
    //格式化日期
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
    // 更新日期显示
    setDateShow: function() {
      this._editDate.value.innerHTML = this.date === this.today ? '今天' : this.date;
    },
    // 日期切换
    switchDate: function(_direction) {
      this.date = this.calDate(this.date, _direction === 'left' ? -1 : 1);
      this.setDateShow();
    },
    // 日期 END
    // TAB START
    // 选中tab
    switchTab: function() {
      var me = this;
      for (var i = 0; i < this._editTabs.length; i++) {
        var _el = this._editTabs[i];
        if (_el.innerHTML === this.currentTab) {
          _Dom.addClass(_el, 'selected');
        } else {
          _Dom.delClass(_el, 'selected');
        }
      }
    },
    delDom: function(li) {
      var me = this;
      var spanStr = li.querySelector('span').innerHTML;
      for (var i = 0; i < me.myData.length; i++) {
        if (me.myData[i].folderName == spanStr) {
          me.myData.splice(i, 1);
          me.classicDom.removeChild(li.parentNode.parentNode);
          break;
        }
      }
      Data.updateStorage(me.myData);
      me.bindNumAllTask();
    },
    addFolder: function(name) {
      var li = document.createElement('li');
      var str = '<h3 class="h-classic">';
      str += '<a href="#"><i class="icon-folder"></i><span>' + name + '</span>(<i class="id-list">0</i>)';
      str += '<button class="addTask-btn"><i class="icon-add"></i></button>';
      str += '<button class="del-btn"><i class="icon-del"></i></button>';
      str += '</a></h3><ul class="list"></ul>';
      li.innerHTML = str;
      this.classicDom.appendChild(li);
      var data = {
        folderName: name,
        tasks: []
      };
      this.myData.push(data);
      Data.updateStorage(this.myData);
      this.bindEvent();
    },
    //addDialog
    bindAddDialogEvent: function() {
      var me = this;
      var addClassicBtn = document.getElementById('addClassicBtn');
      addClassicBtn.addEventListener('click', function() {
        me.addDialog.style.display = 'block';
        me.addDialog.querySelector('.add-input').focus();
      });
      me.addDialog.querySelector('.ok-btn').addEventListener('click', function() {
        var as = me.classicDom.querySelectorAll('.h-classic a span');
        var addinput = me.addDialog.querySelector('.add-input'),
          message = me.addDialog.querySelector('.message');
        if (addinput.value) {
          if (as) {
            for (var a = 0; a < as.length; a++) {
              if (as[a].innerHTML == addinput.value) {
                addinput.value = '';
                addinput.focus();
                message.innerHTML = '该类别已存在';
                break;
              }
            }
          }
          if (a == as.length) {
            me.addFolder(addinput.value);
            me.addDialog.style.display = 'none';
            addinput.value = '';
            message.innerHTML = '';
          }
        } else {
          message.innerHTML = '空!';
        }
      });
    },
    //tasksDialog
    bindTasksDialogEvent: function() {
      var me = this;
      me.tasksDialog.querySelector('.ok-btn').addEventListener('click', function() {
        var a = me.classicDom.querySelector('.h-classic a.active'), //获得task
          list = a.parentNode.nextSibling, //获得task
          tasksDom = list.querySelectorAll('li span'); //获得task
        var input = me.tasksDialog.querySelector('.add-input'),
          message = me.tasksDialog.querySelector('.message');
        if (input.value) {
          if (tasksDom) {
            for (var t = 0; t < tasksDom.length; t++) {
              if (tasksDom[t].innerHTML == input.value) {
                message.innerHTML = '该任务集已存在！';
                input.focus();
                break;
              }
            }
          }
          if (t == tasksDom.length) {
            var search = me.searchData(a.querySelector('span').innerHTML);
            me.tasks.init(search.index, search.tasks);
            me.tasks.addDom(input.value, list);
            me.tasksDialog.style.display = 'none';
            input.value = '';
            message.innerHTML = '';
          }
        }
      });
    },
    bindTasks: function() {
      var folder = this.classicDom.firstChild.querySelectorAll('.h-classic a');
      var search = this.searchData(folder[0].querySelector('span').innerHTML);
      this.tasks.init(search.index, search.tasks);
      this.tasks.bindTask();
    }
  };
  return Edit;
})();
