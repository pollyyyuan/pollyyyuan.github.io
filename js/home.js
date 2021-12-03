// 首页
var Home = (function() {
  function Home() {
    this.today = _Dom.formatDate(new Date());

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
  }
  Home.prototype = {
    // 初始化
    init: function() {
      //绑定DOM
      this.bindDom();
      // 绑定事件
      this.bindEvent();

      this.date = {
        year: new Date(this.today).getFullYear(),
        month: new Date(this.today).getMonth() + 1
      };
      this.setDateShow();

      this.addWeekend();
      this.addCalendar();

      this.setCalendarSelected();
      this.getDataList();
    },
    //绑定DOM
    bindDom: function() {
      this._homePage = _Dom.$('#homePage');
      this._editPopup = _Dom.$('#editPopup');
      this._homeAddBtn = _Dom.$('#homeAddBtn');

      this._homeSwitchDate1 = _Dom.$('#homeSwitchDate1');
      this._homeDate = _Dom.$('#homeDate');
      this._homeSwitchDate2 = _Dom.$('#homeSwitchDate2');

      this._homeCalendar = _Dom.$('#homeCalendar');

      this._homeWeekend = _Dom.$('.weekend-row', this._homeCalendar)[0];
      this._homeCalendarContent = _Dom.$('.content-row', this._homeCalendar)[0];

      this._homeTotalContainer = _Dom.$('#homeTotalContainer');

      this._homeFooter = _Dom.$('#homeFooter');
    },
    //绑定事件
    bindEvent: function() {
      var me = this;
      this._homeAddBtn.addEventListener('click', function() {
        me.openEdit();
      });
      this._homeSwitchDate1.addEventListener('click', function() {
        me.switchDate('left');
      });
      this._homeSwitchDate2.addEventListener('click', function() {
        me.switchDate('right');
      });
    },
    openEdit: function(date) {
      var me = this;
      this._editPopup.style.display = 'block';
      window.setTimeout(function() {
        _Dom.addClass(me._editPopup, 'show');
      }, 0);
      this.edit = new Edit();
      this.edit.init(this, this._editPopup, date);
    },
    // 日历 START
    // 更新日期显示
    setDateShow: function() {
      var month = (this.date.month < 10 ? ('0' + this.date.month) : this.date.month);
      this._homeDate.innerHTML = this.date.year + '年' + month + '月';
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
      this.setDateShow();
      this.addCalendar();
      this.setCalendarSelected();
      this.getDataList();
    },
    // 新增日历头
    addWeekend: function() {
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
      var dayList = [];
      var emptyList = [];
      var days = new Date(this.date.year, this.date.month, 0).getDate(); // 当前月的天数
      for (var i = 1; i <= days; i++) {
        var month = (this.date.month < 10 ? ('0' + this.date.month) : this.date.month);
        var day = (i < 10 ? ('0' + i) : i);
        var date = this.date.year + '-' + month + '-' + day;
        var weekendIdx = new Date(date).getDay();
        var weekend = this.Weekends[weekendIdx].key;
        var weekendName = this.Weekends[weekendIdx].value;
        dayList.push({
          date: date,
          day: i,
          weekend: weekend,
          weekendName: weekendName
        });
      }

      var firstWeekend = dayList[0].weekend;
      if (firstWeekend < 7) {
        emptyList = new Array(firstWeekend);
      }

      for (var j = 0; j < emptyList.length; j++) {
        var col = document.createElement('div');
        col.className = 'col';
        this._homeCalendarContent.appendChild(col);
      }
      for (var k = 0; k < dayList.length; k++) {
        var tmpDay = dayList[k];
        var tmpCol = document.createElement('div');
        tmpCol.className = 'col';
        if (tmpDay.weekend === 6 || tmpDay.weekend === 7) {
          tmpCol.className += ' holiday';
        }
        if (tmpDay.date === this.today) {
          tmpCol.className += ' today';
        }
        tmpCol.innerHTML = '<a><span>' + tmpDay.day + '</span></a>';
        this._homeCalendarContent.appendChild(tmpCol);
      }

      this._homeCalendarDays = _Dom.$('.col a', this._homeCalendarContent);
      for (var f = 0; f < this._homeCalendarDays.length; f++) {
        this._homeCalendarDays[f].addEventListener('click', function(_el) {
          var month = (me.date.month < 10 ? ('0' + me.date.month) : me.date.month);
          var day = _Dom.$('span', _el.target);
          if (day.length > 0) {
            day = day[0].innerHTML;
          } else {
            day = _el.target.innerHTML;
          }
          day = (day < 10 ? ('0' + day) : day);
          me.openEdit(me.date.year + '-' + month + '-' + day);
        });
      }
    },
    // 设置日历选中
    setCalendarSelected: function() {
      var list = Data.getDayListByMonth(this.date.month);
      console.log(list);
      for (var i = 0; i < this._homeCalendarDays.length; i++) {
        var days = this._homeCalendarDays[i];
        var span = _Dom.$('span', this._homeCalendarDays[i])[0];
        var find = list.findIndex(function(val) {
          return val == span.innerHTML;
        });
        if (find > -1) {
          _Dom.addClass(days, 'selected');
        } else {
          _Dom.delClass(days, 'selected');
        }
      }
    },
    // 日历 END
    // 统计 START
    getDataList: function() {
      this.totalList = Data.getDataListByMonth(this.date.month);
      this._homeTotalContainer.innerHTML = '<li class="head-li"><div class="row"><div class="col">日期</div><div class="col">报销</div><div class="col">实际</div><div class="col">对比</div></div></li>';
      var official = 0;
      var total = 0;
      var contrast = 0;
      for (var i = 0; i < this.totalList.length; i++) {
        var data = this.totalList[i];
        official += (data.official || 0);
        total += (data.total || 0);
        this.addTotal(data);
      }
      this.batchBindTotalEvent();
      contrast = official - total;
      contrast = contrast > 0 ? ('+' + contrast) : contrast;
      this._homeFooter.innerHTML = '总计：报销 ' + official + ' 实际 ' + total + ' 对比 ' + contrast;
    },
    // 添加统计
    addTotal: function(data) {
      var me = this;
      var li = document.createElement('li');
      var str = '<div class="row">';
      str += '<div class="col date' + (data.date === this.today ? ' today' : '') + '">' + (data.date === this.today ? '今天' : data.date) + '</div>';
      str += '<div class="col">' + (data.official || 0) + '</div>';
      str += '<div class="col">' + (data.total || 0) + '</div>';
      str += '<div class="col' + (data.contrast > 0 ? ' highlight' : '') + '">' + (data.contrast > 0 ? ('+' + data.contrast) : (data.contrast || 0)) + '</div>';
      str += '</div>';
      li.innerHTML = str;
      this._homeTotalContainer.appendChild(li);
    },
    batchBindTotalEvent: function() {
      var me = this;
      var _totalDates = _Dom.$('.date', this._homeTotalContainer);
      for (var i = 0; i < _totalDates.length; i++) {
        _totalDates[i].addEventListener('click', function(_el) {
          var date = _el.target.innerHTML === '今天' ? '' : _el.target.innerHTML;
          me.openEdit(date);
        });
      }
    }
    // 统计 END
  };
  return Home;
})();
