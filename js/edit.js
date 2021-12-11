// 编辑
var Edit = (function() {
  function Edit() {
    this.today = _Dom.formatDate(new Date());

    this.date = '';

    this.hotelList = [];
    this.hotel = '';

    this.headLiTemplate = '<li class="head-li"><div class="row"><div class="col"></div><div class="col">(报销)</div><div class="col">(实际)</div><div class="col close-col"></div></div></li>';

    //绑定DOM
    this.bindDom();
    // 绑定事件
    this.bindEvent();

    // 初始化数据
    this.currentTab = '交通';
    this.switchTab();
  }
  Edit.prototype = {
    // 初始化
    init: function(home, editPopup, date) {
      var me = this;
      this.home = home;
      this._editPopup = editPopup;

      this.date = date || this.today;
      this.setDateShow();

      this._tag = new Tag(this._editHotelGroup, '', function(result) {
        me.hotelList = result.tagList;
        me.hotel = result.selected;
      });
      this.getCityPrice();
      this.getHotelList();

      this.initData();
    },
    //绑定DOM
    bindDom: function() {
      var me = this;
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

      this._editContainer = _Dom.$('#editContainer');

      this._editTabGroup = _Dom.$('#editTabGroup');
      this._editTabs = _Dom.$('.tab', this._editTabGroup);

      this._editCardContainer = _Dom.$('#editCardContainer');
      this._editCards = {
        traffic: _Dom.$('.traffic-card', this._editCardContainer)[0],
        stay: _Dom.$('.stay-card', this._editCardContainer)[0],
        cost: _Dom.$('.cost-card', this._editCardContainer)[0]
      };
      this.trafficUl = _Dom.$('ul', this._editCards.traffic)[0];
      this.costUl = _Dom.$('ul', this._editCards.cost)[0];

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

      this._trafficCard = _Dom.$('#trafficCard');

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
      this._arrive.addEventListener('blur', function(_el) {
        var price = me.cityPrice[_el.target.value];
        if (price) {
          me._stayOfficial.value = price;
        }
      });
      for (var j = 0; j < this._inputs.length; j++) {
        // this._inputs[j].addEventListener('keyup', function() {
        //   me.fresh();
        // });
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
      this.trafficUl.innerHTML = this.headLiTemplate;
      this.costUl.innerHTML = this.headLiTemplate;
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
          this._tag.select(this.hotel);
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
      this._tag = null;
      _Dom.delClass(this._editPopup, 'show');
      window.setTimeout(function() {
        _Dom.vibrate();
        _Dom.hide(me._editPopup);
        me.home.setCalendarSelected();
        me.home.getDataList();
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
      console.log(this.currentTab);
      switch (this.currentTab) {
        case '交通':
          _Dom.show(this._editCards.traffic);
          _Dom.hide(this._editCards.stay);
          _Dom.hide(this._editCards.cost);
          break;
        case '住宿':
          _Dom.hide(this._editCards.traffic);
          _Dom.show(this._editCards.stay);
          _Dom.hide(this._editCards.cost);
          break;
        case '花销':
          _Dom.hide(this._editCards.traffic);
          _Dom.hide(this._editCards.stay);
          _Dom.show(this._editCards.cost);
          break;
        default:
          break;
      }
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
      str += '<div class="col"><div class="input-container vehicle"><input type="text" placeholder="交通工具"' + (data ? (' value="' + data.vehicle + '"') : '') + '></div></div>';
      str += '<div class="col"><div class="input-container number official"><input type="number"' + (data ? (' value="' + data.official + '"') : '') + '></div></div>';
      str += '<div class="col"><div class="input-container number total"><input type="number"' + (data ? (' value="' + data.total + '"') : '') + '></div></div>';
      str += '<div class="col close-col"></div>';
      str += '</div><div class="row">';
      str += '<div class="col"><div class="input-container mark"><input type="text" placeholder="备注"' + (data ? (' value="' + data.mark + '"') : '') + '></div></div>';
      str += '<div class="col close-col"><a class="icon-del active"><i class="iconfont icon-close-circle-fill"></i></a></div>';
      str += '</div>';
      li.innerHTML = str;
      this.trafficUl.appendChild(li);
      var _trafficDels = _Dom.$('.close-col a', this.trafficUl);
      _trafficDels[_trafficDels.length - 1].addEventListener('click', function(_el) {
        me.delTraffic(_el.target.parentNode.parentNode.parentNode.parentNode);
      });
    },
    //批量绑定 交通删除
    batchBindTrafficEvent: function() {
      var me = this;
      var _trafficDels = _Dom.$('.close-col a', this.trafficUl);
      for (var i = 0; i < _trafficDels.length; i++) {
        _trafficDels[i].addEventListener('click', function(_el) {
          me.delTraffic(_el.target.parentNode.parentNode.parentNode.parentNode);
        });
      }
    },
    // 删除交通
    delTraffic: function(_el) {
      console.log(_el);
      this.trafficUl.removeChild(_el);
    },
    // 交通 END
    // 住宿 START
    // 获取酒店列表
    getHotelList: function() {
      var me = this;
      this.hotelList = Data.getBasicHotel();
      this._tag.addTagGroup(this.hotelList);
    },
    // 住宿 END
    // 花销 START
    // 新增花销
    addCost: function(data) {
      var me = this;
      var li = document.createElement('li');
      var str = '<div class="row">';
      str += '<div class="col"><div class="input-container content"><input type="text" placeholder="招待方式"' + (data ? (' value="' + data.content + '"') : '') + '></div></div>';
      str += '<div class="col"><div class="input-container number official"><input type="number"' + (data ? (' value="' + data.official + '"') : '') + '></div></div>';
      str += '<div class="col"><div class="input-container number total"><input type="number"' + (data ? (' value="' + data.total + '"') : '') + '></div></div>';
      str += '<div class="col close-col"><a class="icon-del active"><i class="iconfont icon-close-circle-fill"></i></a></div>';
      str += '</div>';
      li.innerHTML = str;
      this.costUl.appendChild(li);
      var _costDels = _Dom.$('.close-col a', this.costUl);
      _costDels[_costDels.length - 1].addEventListener('click', function(_el) {
        me.delCost(_el.target.parentNode.parentNode.parentNode.parentNode);
      });
    },
    //批量绑定 花销删除
    batchBindStayEvent: function() {
      var me = this;
      var _costDels = _Dom.$('.close-col a', this.costUl);
      for (var i = 0; i < _costDels.length; i++) {
        _costDels[i].addEventListener('click', function(_el) {
          me.delCost(_el.target.parentNode.parentNode.parentNode.parentNode);
        });
      }
    },
    // 删除花销
    delCost: function(_el) {
      console.log(_el);
      this.costUl.removeChild(_el);
    },
    // 花销 END
    getCityPrice: function() {
      this.cityPrice = Data.getCityPrice();
    },
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
          official: 0,
          total: 0,
          contrast: 0,
          list: []
        },
        stay: {
          hotel: this.hotel || '',
          official: Number(this._stayOfficial.value || 0),
          total: Number(this._stayTotal.value || 0),
          contrast: 0
        },
        cost: {
          official: 0,
          total: 0,
          contrast: 0,
          list: []
        }
      };
      var _traffics = _Dom.$('li:not(.head-li)', this.trafficUl);
      for (var i = 0; i < _traffics.length; i++) {
        var li = _traffics[i];
        var tmp = {
          vehicle: _Dom.$('.vehicle input', li)[0].value || '',
          official: Number(_Dom.$('.official input', li)[0].value || 0),
          total: Number(_Dom.$('.total input', li)[0].value || 0),
          mark: _Dom.$('.mark input', li)[0].value || 0,
        };
        params.traffic.official += tmp.official;
        params.traffic.total += tmp.total;
        tmp.contrast = tmp.official - tmp.total;
        if (tmp.vehicle && (tmp.official || tmp.total)) {
          params.traffic.list.push(tmp);
        }
      }
      params.traffic.contrast = params.traffic.official - params.traffic.total;
      params.stay.contrast = params.stay.official - params.stay.total;
      params.official += params.stay.official;
      params.total += params.stay.total;
      var _cost = _Dom.$('li:not(.head-li)', this.costUl);
      console.log(_cost);
      for (var j = 0; j < _cost.length; j++) {
        var costLi = _cost[j];
        var costTmp = {
          content: _Dom.$('.content input', costLi)[0].value || '',
          official: Number(_Dom.$('.official input', costLi)[0].value || 0),
          total: Number(_Dom.$('.total input', costLi)[0].value || 0)
        };
        costTmp.contrast = costTmp.official - costTmp.total;
        params.cost.official += costTmp.official;
        params.cost.total += costTmp.total;
        if (costTmp.content && (costTmp.official || costTmp.total)) {
          params.cost.list.push(costTmp);
        }
      }
      params.cost.contrast = params.cost.official - params.cost.total;
      params.official = params.traffic.official + params.stay.official + params.cost.official;
      params.total = params.traffic.total + params.stay.total + params.cost.total;
      params.contrast = params.official - params.total;
      console.log('存储参数>>>>', params);
      Data.saveData(params);
      Data.addBasicHotel(this.hotelList);
      _Dom.tip('success', 1000);
      if (state === 'add') {
        this.date = _Dom.calDate(new Date(this.date), 1);
        this.setDateShow();
        this.initData('init');
      } else {
        this.close();
      }
    },
    del: function() {
      Data.delData(this.date);
      _Dom.tip('success', 1000);
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
