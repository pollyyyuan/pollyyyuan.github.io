// 编辑
var Edit = (function() {
  function Edit() {
    this.today = _Dom.formatDate(new Date());

    this.hotelList = [];

    this.date = '';
    this.hotel = '';

    this.headLiTemplate = '<li class="head-li"><div class="row"><div class="col"></div><div class="col">(报销)</div><div class="col">(实际)</div><div class="col close-col"></div></div></li>';

  }
  Edit.prototype = {
    // 初始化
    init: function(home, editPopup, date) {
      this.home = home;
      this._editPopup = editPopup;

      //绑定DOM
      this.bindDom();
      // 绑定事件
      this.bindEvent();
      // 初始化数据

      this.date = date || this.today;
      this.setDateShow();

      this.currentTab = '交通';
      this.switchTab();

      this.getHotelList();

      this.initData();

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

      this._inputs = _Dom.$('input', this._editPage);

      this._stayOfficial = _Dom.$('#stayOfficial');
      this._stayTotal = _Dom.$('#stayTotal');

      this._costAddBtn = _Dom.$('#costAddBtn'); // 花销新增按钮

      this._editSaveBtn1 = _Dom.$('#editSaveBtn1');
      this._editDelBtn = _Dom.$('#editDelBtn');

    },
    //绑定事件
    bindEvent: function() {
      var me = this;
      this._editCloseBtn.addEventListener('click', function() {
        me.close();
      });
      this._editSaveBtn.addEventListener('click', function() {
        me.save();
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
      for (var j = 0; j < this._inputs.length; j++) {
        this._inputs[j].addEventListener('keyup', function() {
          me.fresh();
        });
      }
      this._costAddBtn.addEventListener('click', function() {
        console.log('cost');
        me.addCost();
      });
      this._editSaveBtn1.addEventListener('click', function() {
        me.save('add');
      });
      this._editDelBtn.addEventListener('click', function() {
        me.del();
      });
    },
    // 初始化数据
    initData: function(state) {
      var tmp = Data.getDataListByDate(this.date);
      this._work.value = state ? '' : (tmp.work || '');
      this._leave.value = state ? '' : (tmp.traffic ? (tmp.traffic.leave || '') : '');
      this._arrive.value = state ? '' : (tmp.traffic ? (tmp.traffic.arrive || '') : '');
      this._stayOfficial.value = state ? '' : (tmp.stay ? (tmp.stay.official || '') : '');
      this._stayTotal.value = state ? '' : (tmp.stay ? (tmp.stay.total || '') : '');
      this._editCards.traffic.innerHTML = this.headLiTemplate;
      this._editCards.cost.innerHTML = this.headLiTemplate;
      if (state) {
        this.addTraffic();
        this.addCost();
      } else {
        if (tmp.traffic && tmp.traffic.list.length > 0) {
          for (var i = 0; i < tmp.traffic.list.length; i++) {
            this.addTraffic(tmp.traffic.list[i]);
          }
          this.batchBindTrafficEvent();
        } else {
          this.addTraffic();
        }
        if (tmp.stay && tmp.stay.hotel) {
          this.hotel = tmp.stay.hotel;
          this.switchHotel();
        }
        if (tmp.cost && tmp.cost.list.length > 0) {
          for (var j = 0; j < tmp.cost.list.length; j++) {
            this.addCost(tmp.cost.list[j]);
          }
          this.batchBindStayEvent();
        } else {
          this.addCost();
        }
      }
    },
    close: function() {
      var me = this;
      _Dom.delClass(this._editPopup, 'show');
      window.setTimeout(function() {
        _Dom.vibrate();
        me._editPopup.style.display = 'none';
        this.home.setCalendarSelected();
        this.home.getDataList();
      }, 300);
    },
    // 日期 START
    // 更新日期显示
    setDateShow: function() {
      console.log(this.today);
      this._editDate.value.innerHTML = this.date === this.today ? '今天' : this.date;
    },
    // 日期切换
    switchDate: function(_direction) {
      this.date = _Dom.calDate(this.date, _direction === 'left' ? -1 : 1);
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
    addTraffic: function(data) {
      console.log(data);
      var me = this;
      var li = document.createElement('li');
      var str = '<div class="row">';
      str += '<div class="col"><div class="input-container vehicle"><input type="text"' + (data ? (' value="' + data.vehicle + '"') : '') + '></div></div>';
      str += '<div class="col"><div class="input-container number official"><input type="number"' + (data ? (' value="' + data.official + '"') : '') + '></div></div>';
      str += '<div class="col"><div class="input-container number total"><input type="number"' + (data ? (' value="' + data.total + '"') : '') + '></div></div>';
      str += '<div class="col close-col"><a><i class="iconfont icon-close-circle-fill"></i></a></div>';
      str += '</div>';
      li.innerHTML = str;
      this._editCards.traffic.appendChild(li);
      var _trafficDels = _Dom.$('.close-col a', this._editCards.traffic);
      _trafficDels[_trafficDels.length - 1].addEventListener('click', function(_el) {
        me.delTraffic(_el.target.parentNode.parentNode.parentNode.parentNode);
      });
    },
    //批量绑定 交通删除
    batchBindTrafficEvent: function() {
      var me = this;
      var _trafficDels = _Dom.$('.close-col a', this._editCards.traffic);
      for (var i = 0; i < _trafficDels.length; i++) {
        _trafficDels[i].addEventListener('click', function(_el) {
          me.delTraffic(_el.target.parentNode.parentNode.parentNode.parentNode);
        });
      }
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
      this.clearHotel();
      for (var i = 0; i < this.hotelList.length; i++) {
        var val = this.hotelList[i];
        this.addHotel(val, 'init');
      }
      this._hotels = _Dom.$('.tag:not(.input-container)', this._editHotelGroup);
      for (var j = 0; j < this._hotels.length; j++) {
        this._hotels[j].addEventListener('click', function(_el) {
          if (me.hotel === _el.target.innerHTML) {
            me.hotel = '';
            _Dom.delClass(_el.target, 'selected');
          } else {
            me.hotel = _el.target.innerHTML;
            me.switchHotel();
          }
        });
      }
      this._hotelInput = _Dom.$('.input-container input', this._editHotelGroup)[0];
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
          me.hotel = _el.target.innerHTML;
          me.switchHotel();
        });
      }
    },
    // 切换酒店
    switchHotel: function() {
      var me = this;
      for (var i = 0; i < this._hotels.length; i++) {
        var _el = this._hotels[i];
        if (_el.innerHTML === this.hotel) {
          _Dom.addClass(_el, 'selected');
        } else {
          _Dom.delClass(_el, 'selected');
        }
      }
    },
    // 清空酒店DOM
    clearHotel: function() {
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
          me.hotel = val;
          me.switchHotel();
          this.hotelList.push(val);
        }
        this._hotelInput.value = '';
      }
    },
    // 住宿 END
    // 花销 START
    // 新增花销
    addCost: function(data) {
      console.log('addCost');
      var me = this;
      var li = document.createElement('li');
      var str = '<div class="row">';
      str += '<div class="col"><div class="input-container content"><input type="text"' + (data ? (' value="' + data.content + '"') : '') + '></div></div>';
      str += '<div class="col"><div class="input-container number official"><input type="number"' + (data ? (' value="' + data.official + '"') : '') + '></div></div>';
      str += '<div class="col"><div class="input-container number total"><input type="number"' + (data ? (' value="' + data.total + '"') : '') + '></div></div>';
      str += '<div class="col close-col"><a><i class="iconfont icon-close-circle-fill"></i></a></div>';
      str += '</div>';
      li.innerHTML = str;
      this._editCards.cost.appendChild(li);
      var _costDels = _Dom.$('.close-col a', this._editCards.cost);
      _costDels[_costDels.length - 1].addEventListener('click', function(_el) {
        me.delCost(_el.target.parentNode.parentNode.parentNode.parentNode);
      });
    },
    //批量绑定 花销删除
    batchBindStayEvent: function() {
      var me = this;
      var _costDels = _Dom.$('.close-col a', this._editCards.cost);
      for (var i = 0; i < _costDels.length; i++) {
        _costDels[i].addEventListener('click', function(_el) {
          me.delCost(_el.target.parentNode.parentNode.parentNode.parentNode);
        });
      }
    },
    // 删除花销
    delCost: function(_el) {
      console.log(_el);
      this._editCards.cost.removeChild(_el);
    },
    // 花销 END
    save: function(state) {
      var params = {
        date: this.date,
        work: this._work.value || '',
        official: 0,
        total: 0,
        contrast: 0,
        traffic: {
          leave: this._leave.value || '',
          arrive: this._arrive.value || '',
          list: []
        },
        stay: {
          hotel: this.hotel || '',
          official: this._stayOfficial.value || 0,
          total: this._stayTotal.value || 0,
          contrast: 0
        },
        cost: {
          list: []
        }
      };
      var _traffics = _Dom.$('li:not(.head-li)', this._editCards.traffic);
      for (var i = 0; i < _traffics.length; i++) {
        var li = _traffics[i];
        var tmp = {
          vehicle: _Dom.$('.vehicle input', li)[0].value || '',
          official: _Dom.$('.official input', li)[0].value || 0,
          total: _Dom.$('.total input', li)[0].value || 0
        };
        params.official += Number(tmp.official);
        params.total += Number(tmp.total);
        console.log(tmp);
        tmp.contrast = Number(tmp.official) - Number(tmp.total);
        if (tmp.vehicle && (tmp.official || tmp.total)) {
          params.traffic.list.push(tmp);
        }
      }
      params.stay.contrast = Number(params.stay.official) - Number(params.stay.total);
      params.official += Number(params.stay.official);
      params.total += Number(params.stay.total);
      var _cost = _Dom.$('li:not(.head-li)', this._editCards.cost);
      console.log(_cost);
      for (var j = 0; j < _cost.length; j++) {
        var costLi = _cost[j];
        var costTmp = {
          content: _Dom.$('.content input', costLi)[0].value || '',
          official: _Dom.$('.official input', costLi)[0].value || 0,
          total: _Dom.$('.total input', costLi)[0].value || 0
        };
        costTmp.contrast = Number(costTmp.official) - Number(costTmp.total);
        params.official += Number(costTmp.official);
        params.total += Number(costTmp.total);
        if (costTmp.content && (costTmp.official || costTmp.total)) {
          params.cost.list.push(costTmp);
        }
      }
      params.contrast = Number(params.official) - Number(params.total);
      console.log('存储参数>>>>', params);
      Data.saveData(params);
      if (state === 'add') {
        this.date = _Dom.calDate(new Date(this.date), 1);
        this.initData('init');
      } else {
        this.close();
      }
    },
    del: function() {
      Data.delData(this.date);
      this.close();
    },
    fresh: function() {
      window.setTimeout(function() {
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
        window.scroll(0, 0);
      }, 0);
    }
  };
  return Edit;
})();
