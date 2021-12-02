// 编辑
var Edit = (function() {
  function Edit() {
    this.today = this.formatDate(new Date());

    this.hotelList = [];

    this.data = {
      date: '', // 日期
      work: '', // 事务
      leave: '', // 出发地
      arrive: '', // 到达地
      hotel: ''
    };

    this.trafficList = []; // 交通列表
    this.stayList = [];
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
      this.data.date = this.today;
      this.setDateShow();

      this.currentTab = '交通';
      this.switchTab();

      this.addTraffic();

      this.getHotelList();
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
        traffic: _Dom.$('.traffic-card ul', this._editCardContainer)[0],
        stay: _Dom.$('.stay-card', this._editCardContainer)[0],
        cost: _Dom.$('.cost-card ul', this._editCardContainer)[0]
      };

      this._leave = _Dom.$('#editLeave'); // 出发地
      this._arrive = _Dom.$('#editArrive'); // 到达地

      this._trafficAddBtn = _Dom.$('#trafficAddBtn'); // 交通新增按钮

      this._editHotelGroup = _Dom.$('.tag-group', this._editCards.stay)[0];
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
          me.switchTab();
        });
      }
      this._trafficAddBtn.addEventListener('click', function() {
        me.addTraffic();
      });

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
      this._editDate.value.innerHTML = this.data.date === this.today ? '今天' : this.date;
    },
    // 日期切换
    switchDate: function(_direction) {
      this.data.date = this.calDate(this.data.date, _direction === 'left' ? -1 : 1);
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
    // TAB END
    // 交通 START
    // 新增
    addTraffic: function() {
      var me = this;
      var li = document.createElement('li');
      var str = '<div class="row">';
      str += '<div class="col"><div class="input-container vehicle"><input type="text"></div></div>';
      str += '<div class="col"><div class="input-container number official"><input type="number"></div></div>';
      str += '<div class="col"><div class="input-container number total"><input type="number"></div></div>';
      str += '<div class="col close-col"><a><i class="iconfont icon-close-circle-fill"></i></a></div>';
      str += '</div>';
      li.innerHTML = str;
      this._editCards.traffic.appendChild(li);
      var _trafficDels = _Dom.$('.close-col a', this._editCards.traffic);
      _trafficDels[_trafficDels.length - 1].addEventListener('click', function(_el) {
        me.delTraffic(_el.target.parentNode.parentNode.parentNode.parentNode);
      });
    },
    // 删除交通
    delTraffic: function(_el) {
      console.log(_el);
      this._editCards.traffic.removeChild(_el);
    },
    // 交通 END
    // 住宿 START
    // 获取酒店列表
    getHotelList: function() {
      var me = this;
      this.hotelList = Data.getBasicHotel();
      this.clearHotelDom();
      for (var i = 0; i < this.hotelList.length; i++) {
        var val = this.hotelList[i];
        this.addHotel(val, 'init');
      }
      this._hotels = _Dom.$('.tag:not(.input-container)', this._editHotelGroup);
      this._hotelInput = _Dom.$('.input-container input', this._editHotelGroup)[0];
      for (var j = 0; j < this._hotels.length; j++) {
        this._hotels[j].addEventListener('click', function(_el) {
          me.data.hotel = _el.target.innerHTML;
          me.switchHotel();
        });
      }
      this._hotelInput.addEventListener('blur', function(_el) {
        me.customHotel(_el.target.value);
      });
    },
    // 新增酒店
    addHotel: function(val, state) {
      var me = this;
      if (!val) return;
      var div = document.createElement('div');
      div.className = 'tag';
      div.innerHTML = val;
      var last = this._editHotelGroup.lastChild;
      this._editHotelGroup.insertBefore(div, last);
      if (state === 'custom') {
        this._hotels = _Dom.$('.tag:not(.input-container)', this._editHotelGroup);
        this._hotels[this._hotels.length - 1].addEventListener('click', function(_el) {
          me.data.hotel = _el.target.innerHTML;
          me.switchHotel();
        });
      }
    },
    // 切换酒店
    switchHotel: function() {
      var me = this;
      for (var i = 0; i < this._hotels.length; i++) {
        var _el = this._hotels[i];
        if (_el.innerHTML === this.data.hotel) {
          _Dom.addClass(_el, 'selected');
        } else {
          _Dom.delClass(_el, 'selected');
        }
      }
    },
    // 清空酒店DOM
    clearHotelDom: function() {
      this._editHotelGroup.innerHTML = '<div class="tag input-container"><input type="text" placeholder="自定义"></div>';
    },
    // 自定义酒店
    customHotel: function(val) {
      var me = this;
      if (val) {
        var find = this.hotelList.findIndex(function(check) {
          return check === val;
        });
        if (find === -1) {
          me.addHotel(val, 'custom');
          me.data.hotel = val;
          me.switchHotel();
          this.hotelList.push(val);
        }
        this._hotelInput.value = '';
      }
    },
    // 住宿 END
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
