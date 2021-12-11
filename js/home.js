// 首页
var Home = (function() {
  function Home() {
    this.today = _Dom.formatDate(new Date());
    this.point_date = 0; // 0代表不管控
    this.subsidy = {
      current_day_cost: 0,
      cross_day_cost: 0
    };

    this.date = {
      year: null,
      month: null,
      day: null,
      s_year: null,
      s_month: null,
      s_day: null,
      start: null,
      end: null
    };

    this.totalSearch = {
      contrast: false,
      type: 'all'
    };

    this.totalRes = {
      official: 0,
      total: 0,
      contrast: 0
    };

    this.Weekends = [{
        key: 7,
        value: '日'
      },
      {
        key: 1,
        value: '一'
      },
      {
        key: 2,
        value: '二'
      },
      {
        key: 3,
        value: '三'
      },
      {
        key: 4,
        value: '四'
      },
      {
        key: 5,
        value: '五'
      },
      {
        key: 6,
        value: '六'
      }
    ];

    this.edit = new Edit();
    this.user = new User();

  }
  Home.prototype = {
    // 初始化
    init: function() {
      //绑定DOM
      this.bindDom();
      // 绑定事件
      this.bindEvent();

      this.addWeekend();

      this.initDate();

      this.totalSearch.type = '差旅';
      this.switchTotalType();

      this.getDataList();
    },
    //绑定DOM
    bindDom: function() {
      this._homePage = _Dom.$('#homePage');
      this._editPopup = _Dom.$('#editPopup');
      this._userPopup = _Dom.$('#userPopup');
      this._homeUserBtn = _Dom.$('#homeUserBtn');
      this._homeAddBtn = _Dom.$('#homeAddBtn');

      this._homeSwitchDate1 = _Dom.$('#homeSwitchDate1');
      this._homeStartDate = _Dom.$('#homeStartDate');
      this._homeEndDate = _Dom.$('#homeEndDate');
      this._homeSwitchDate2 = _Dom.$('#homeSwitchDate2');

      this._homeCalendar = _Dom.$('#homeCalendar');

      this._homeWeekend = _Dom.$('.weekend-row', this._homeCalendar)[0];
      this._homeCalendarContent = _Dom.$('.content-row', this._homeCalendar)[0];

      this._homeTotalContainer = _Dom.$('#homeTotalContainer');
      this._searchTagGroup = _Dom.$('#searchTagGroup');
      this._searchTags = _Dom.$('.tag', this._searchTagGroup);

      this._searchSwitchGroup = _Dom.$('#searchSwitchGroup');

      this._homeFooter = _Dom.$('#homeFooter');
    },
    //绑定事件
    bindEvent: function() {
      var me = this;
      document.addEventListener('touchstart', function(event) {
        if (event.touches.length > 1) {
          event.preventDefault();
        }
      });
      var lastTouchEnd = 0;
      document.addEventListener('touched', function(event) {
        var now = (new Date()).getTime();
        if (now - lastTouchEnd <= 300) {
          event.preventDefault();
        }
        lastTouchEnd = now;
      }, false);
      this._homeAddBtn.addEventListener('click', function() {
        me.openEdit();
      });
      this._homeUserBtn.addEventListener('click', function() {
        me.openUser();
      });
      this._homeSwitchDate1.addEventListener('click', function() {
        me.switchDate('left');
      });
      this._homeSwitchDate2.addEventListener('click', function() {
        me.switchDate('right');
      });
      this._searchTagGroup.addEventListener('click', function(_el) {
        if (_el.target.innerHTML === me.totalSearch.type) {
          me.totalSearch.type = '全部';
        } else {
          me.totalSearch.type = _el.target.innerHTML;
        }
        me.switchTotalType();
        me.getDataList();
      });
      this._searchSwitchGroup.addEventListener('click', function() {
        me.switchContrast();
        me.getDataList();
      });
    },
    openUser: function() {
      var me = this;
      _Dom.show(this._userPopup);
      window.setTimeout(function() {
        _Dom.addClass(me._userPopup, 'show');
      }, 0);
      this.user.init(this, this._userPopup);
    },
    openEdit: function(date) {
      var me = this;
      _Dom.show(this._editPopup);
      window.setTimeout(function() {
        _Dom.addClass(me._editPopup, 'show');
      }, 0);
      this.edit.init(this, this._editPopup, date);
    },
    // 日历 START
    // 初始化日期
    initDate: function() {
      var user = Data.getUser();
      this.point_date = user.point_date || 0;
      this.subsidy = {
        current_day_cost: user.current_day_cost,
        cross_day_cost: user.cross_day_cost
      };
      this.date.year = new Date(this.today).getFullYear();
      this.date.month = new Date(this.today).getMonth() + 1;
      this.calDateRange();
      this.addCalendar();
      this.setCalendarSelected();
    },
    // 计算日期范围
    calDateRange: function() {
      this.date.s_year = this.date.month === 1 ? (this.date.year - 1) : this.date.year;
      this.date.s_month = this.date.month === 1 ? 12 : (this.date.month - 1);
      var date = this.pointDate(this.date.year, this.date.month);
      var startDate = this.pointDate(this.date.s_year, this.date.s_month);
      this.date.end = date.date;
      this.date.day = date.day;
      this.date.start = startDate.date;
      this.date.s_day = startDate.day;
      console.log(this.date);
      this.setDateShow();
    },
    // 根据指定天数更改日期
    pointDate: function(year, month) {
      var lastDay = new Date(year, month, 0).getDate(); // 当月最后一天
      var day = this.point_date ? (this.point_date < lastDay ? this.point_date : lastDay) : lastDay;
      return {
        date: _Dom.formatDate(new Date(year, month - 1, day)),
        day: Number(day)
      };
    },
    // 更新日期显示
    setDateShow: function() {
      this._homeStartDate.innerHTML = this.date.start;
      this._homeEndDate.innerHTML = this.date.end;
    },
    // 日期切换
    switchDate: function(_direction) {
      if (_direction === 'left') {
        if (this.date.month === 1) {
          this.date.year--;
          this.date.month = 12;
        } else {
          this.date.month--;
        }
      } else {
        if (this.date.month === 12) {
          this.date.year++;
          this.date.month = 1;
        } else {
          this.date.month++;
        }
      }
      this.calDateRange();
      this.addCalendar();
      this.setCalendarSelected();
      this.getDataList();
    },
    // 新增日历头
    addWeekend: function() {
      this._homeWeekend.innerHTML = '';
      for (var i = 0; i < this.Weekends.length; i++) {
        var tmp = this.Weekends[i];
        var div = document.createElement('div');
        div.className = (tmp.key === 6 || tmp.key === 7) ? 'col weekend holiday' : 'col weekend';
        div.innerHTML = this.Weekends[i].value;
        this._homeWeekend.appendChild(div);
      }
    },
    // 初始化日历
    addCalendar: function() {
      var me = this;
      this._homeCalendarContent.innerHTML = '';
      this.dayList = [];
      var emptyList = [];
      if (this.point_date) { // 没值代表整月
        var sFullDays = new Date(this.date.s_year, this.date.s_month, 0).getDate(); // 当前月的天数
        var sDays = sFullDays - this.date.s_day;
        for (var i = this.date.s_day + 1; i <= sFullDays; i++) {
          var s_month = (this.date.s_month < 10 ? ('0' + this.date.s_month) : this.date.s_month);
          var s_day = (i < 10 ? ('0' + i) : i);
          var start = this.date.s_year + '-' + s_month + '-' + s_day;
          var s_weekendIdx = new Date(start).getDay();
          var s_weekend = this.Weekends[s_weekendIdx].key;
          var s_weekendName = this.Weekends[s_weekendIdx].value;
          this.dayList.push({
            date: _Dom.formatDate(new Date(start)),
            day: i,
            weekend: s_weekend,
            weekendName: s_weekendName
          });
        }
      }
      var days = this.point_date ? this.date.day : new Date(this.date.year, this.date.month, 0).getDate(); // 当前月的天数
      for (var j = 1; j <= days; j++) {
        var month = (this.date.month < 10 ? ('0' + this.date.month) : this.date.month);
        var day = (j < 10 ? ('0' + j) : j);
        var date = this.date.year + '-' + month + '-' + day;
        var weekendIdx = new Date(date).getDay();
        var weekend = this.Weekends[weekendIdx].key;
        var weekendName = this.Weekends[weekendIdx].value;
        this.dayList.push({
          date: _Dom.formatDate(new Date(date)),
          day: j,
          weekend: weekend,
          weekendName: weekendName
        });
      }

      var firstWeekend = this.dayList[0].weekend;
      if (firstWeekend < 7) {
        emptyList = new Array(firstWeekend);
      }

      for (var k = 0; k < emptyList.length; k++) {
        var col = document.createElement('div');
        col.className = 'col';
        this._homeCalendarContent.appendChild(col);
      }
      for (var f = 0; f < this.dayList.length; f++) {
        var tmpDay = this.dayList[f];
        var tmpCol = document.createElement('div');
        tmpCol.className = 'col';
        if (tmpDay.weekend === 6 || tmpDay.weekend === 7) {
          tmpCol.className += ' holiday';
        }
        if (tmpDay.date === this.today) {
          tmpCol.className += ' today';
        }
        tmpCol.innerHTML = '<a class="active"><span>' + tmpDay.day + '</span>' + (f === this.dayList.length - 1 ? '<i class="iconfont icon-alert"></icon>' : '') + '</a>';
        this._homeCalendarContent.appendChild(tmpCol);
      }

      this._homeCalendarDays = _Dom.$('.col a', this._homeCalendarContent);
      for (var e = 0; e < this._homeCalendarDays.length; e++) {
        this._homeCalendarDays[e].addEventListener('click', function(_el) {
          var day = _Dom.$('span', _el.target);
          if (day.length > 0) {
            day = day[0].innerHTML;
          } else {
            day = _el.target.innerHTML;
          }
          console.log(me.dayList);
          var find = me.dayList.findIndex(function(obj) {
            return obj.day == day;
          });
          console.log(find);
          if (find > -1) {
            me.openEdit(me.dayList[find].date);
          }
        });
      }
    },
    // 设置日历选中
    setCalendarSelected: function() {
      var me = this;
      var list = Data.getDateListByMonth([this.date.s_month, this.date.month]);
      console.log(list);
      for (var i = 0; i < this._homeCalendarDays.length; i++) {
        var days = this._homeCalendarDays[i];
        var span = _Dom.$('span', this._homeCalendarDays[i])[0];
        var find = this.dayList.findIndex(function(obj) {
          return obj.day == span.innerHTML;
        });
        if (find > -1) {
          var find1 = list.findIndex(function(val) {
            return val == me.dayList[find].date;
          });
          if (find1 > -1) {
            _Dom.addClass(days, 'selected');
          } else {
            _Dom.delClass(days, 'selected');
          }
        }

      }
    },
    // 日历 END
    // 统计 START
    // 统计视图切换
    switchTotalType: function() {
      var me = this;
      for (var i = 0; i < this._searchTags.length; i++) {
        var _el = this._searchTags[i];
        if (_el.innerHTML === this.totalSearch.type) {
          _Dom.addClass(_el, 'selected');
        } else {
          _Dom.delClass(_el, 'selected');
        }
      }
    },
    // 实际金额显示切换
    switchContrast: function() {
      this.totalSearch.contrast = !this.totalSearch.contrast;
      if (this.totalSearch.contrast) {
        _Dom.addClass(this._searchSwitchGroup, 'open');
      } else {
        _Dom.delClass(this._searchSwitchGroup, 'open');
      }
    },
    getDataList: function() {
      this.totalList = Data.getDataListByDateRange(this.date.start, this.date.end);
      console.log(this.totalList);
      this._homeTotalContainer.innerHTML = this.totalList.length > 0 ? '' : '<div class="no-data">暂无数据！</div>';
      this.totalRes.official = 0;
      this.totalRes.total = 0;
      this.totalRes.contrast = 0;
      for (var i = 0; i < this.totalList.length; i++) {
        var data = this.totalList[i];
        var result = this.addTotal(data);
        this.totalRes.official += Number(result.official || 0);
        this.totalRes.total += Number(result.total || 0);
      }
      this.batchBindTotalEvent();
      this.totalRes.contrast = this.totalRes.official - this.totalRes.total;
      this.addHomeFooter();
    },
    // 添加统计
    addTotal: function(data) {
      var me = this;
      var official = 0;
      var total = 0;
      var contrast = 0;

      var div = document.createElement('div');
      _Dom.addClass(div, 'card');
      var str = '<div class="date-tag">' + data.date + '</div>';
      if (this.totalSearch.type !== '招待') {
        official += Number(data.traffic.official || 0);
        official += Number(data.stay.official || 0);
        if (this.totalSearch.contrast) {
          total += Number(data.traffic.total || 0);
          total += Number(data.stay.total || 0);
        }
        str += '<div class="row"><div class="col"><div class="label">事由：</div>';
        str += '<div class="text">' + data.work + '</div></div></div>';
        str += '<div class="row"><div class="col"><div class="label">出发：</div>';
        if (data.traffic) {
          str += '<div class="text">' + data.traffic.leave + '</div>';
        }
        str += '</div>';
        str += '<div class="col col2"><div class="label">到达：</div>';
        if (data.traffic) {
          str += '<div class="text">' + data.traffic.arrive + '</div>';
        }
        str += '</div></div>';
        str += '<div class="row"><div class="col"><div class="label">交通工具：</div><div class="text wrap">';
        if (data.traffic && data.traffic.list && data.traffic.list.length > 0) {
          official += Number(data.cost.official || 0);
          if (this.totalSearch.contrast) {
            total += Number(data.cost.total || 0);
          }
          for (var i = 0; i < data.traffic.list.length; i++) {
            var traffic = data.traffic.list[i];
            str += '<div class="row"><div class="col">';
            str += '<div class="text">' + traffic.vehicle;
            if (traffic.mark) {
              str += '<span>（' + traffic.mark + '）</span>';
            }
            str += '</div>';
            str += '<div class="price-wrap ' + (this.totalSearch.contrast ? '' : 'single') + '">';
            str += '<span>' + traffic.official + '</span>';
            if (this.totalSearch.contrast) {
              str += '<span>' + traffic.total + '</span>';
            }
            str += '</div></div></div>';
          }
        }
        str += '</div></div></div>';
        str += '<div class="row"><div class="col"><div class="label">住宿：</div>';
        str += '<div class="text col">';
        if (data.stay) {
          str += '<div class="text">' + data.stay.hotel + '</div>';
        }
        str += '<div class="price-wrap ' + (this.totalSearch.contrast ? '' : 'single') + '"><span>' + data.stay.official + '</span>';
        if (this.totalSearch.contrast) {
          str += '<span>' + data.stay.total + '</span>';
        }
        str += '</div></div></div></div>';
      }
      if (this.totalSearch.type !== '差旅') {
        str += '<div class="row"><div class="col"><div class="label">招待：</div><div class="text wrap">';
        if (data.cost && data.cost.list && data.cost.list.length > 0) {
          for (var j = 0; j < data.cost.list.length; j++) {
            var cost = data.cost.list[j];
            str += '<div class="row"><div class="col">';
            str += '<div class="text">' + cost.content + '</div>';
            str += '<div class="price-wrap ' + (this.totalSearch.contrast ? '' : 'single') + '">';
            str += '<span>' + cost.official + '</span>';
            if (this.totalSearch.contrast) {
              str += '<span>' + cost.total + '</span>';
            }
            str += '</div></div></div>';
          }
        }
        str += '</div></div></div>';
      }
      if (this.totalSearch.contrast) {
        contrast = official - total;
      }
      str += '<div class="row total-footer"><div class="col-auto"><div class="label">补贴：</div>';
      data.subsidy = 0;
      if (data.stay.hotel || data.stay.official) {
        data.subsidy = this.subsidy.cross_day_cost;
      } else if (data.traffic.leave) {
        data.subsidy = this.subsidy.current_day_cost;
      }
      str += '<div class="price-wrap single"><span>' + data.subsidy + '</span></div>';
      str += '</div><div class="col"><div class="label">总计：</div>';
      str += '<div class="price-wrap ' + (this.totalSearch.contrast ? '' : 'single') + '"><span>' + official + '</span>';
      if (this.totalSearch.contrast) {
        str += '<span>' + total + '</span>';
      }
      str += '</div>';
      if (this.totalSearch.contrast) {
        str += '<div class="contrast"><span>' + (contrast > 0 ? ('+' + contrast) : contrast) + '</span></div>';
      }
      div.innerHTML = str;
      this._homeTotalContainer.appendChild(div);
      return {
        official: official,
        total: total,
        contrast: contrast
      };
    },
    batchBindTotalEvent: function() {
      var me = this;
      var _totalDates = _Dom.$('.date-tag', this._homeTotalContainer);
      console.log(_totalDates);
      for (var i = 0; i < _totalDates.length; i++) {
        _totalDates[i].addEventListener('click', function(_el) {
          var date = _el.target.innerHTML === '今天' ? '' : _el.target.innerHTML;
          me.openEdit(date);
        });
      }
    },
    addHomeFooter: function() {
      var _num = _Dom.$('.num-group span', this._homeFooter)[0];
      var _res = _Dom.$('.price-wrap', this._homeFooter)[0];
      var str = '<span>' + (this.totalRes.official || 0) + '</span>';
      var str1 = '';
      if (this.totalSearch.contrast) {
        str += '<span>' + (this.totalRes.total || 0) + '</span>';
        str1 = this.totalRes.contrast > 0 ? ('+' + this.totalRes.contrast) : this.totalRes.contrast;
      }
      var _contrast = _Dom.$('.contrast span', this._homeFooter)[0];
      _num.innerHTML = this.totalList.length || 0;
      _res.innerHTML = str;
      _contrast.innerHTML = str1;
    }
    // 统计 END
  };
  return Home;
})();
