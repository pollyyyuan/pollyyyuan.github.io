// 个人中心
var User = (function() {
  function User() {

    this.hotelList = [];
    this.hotel = '';

    //绑定DOM
    this.bindDom();
    // 绑定事件
    this.bindEvent();

    // 初始化数据
  }
  User.prototype = {
    // 初始化
    init: function(home, userPopup) {
      var me = this;
      this.home = home;
      this._userPopup = userPopup;

      this._tag = new Tag(this._editHotelGroup, 'show', function(result) {
        me.hotelList = result.tagList;
        me.hotel = result.selected;
      });
      this.initData();
      this.getHotelList();

      this.getCityPrice();

    },
    bindDom: function() {
      this._userPage = _Dom.$('#userPage');
      this._userBackBtn = _Dom.$('#userBackBtn');
      this._userDefaultBtn = _Dom.$('#userDefaultBtn');

      this._pointDate = _Dom.$('#userPointDate');

      this._editHotelGroup = _Dom.$('.tag-group', this._userPage)[0];

      this._currentDayCost = _Dom.$('#currentDayCost');
      this._crossDayCost = _Dom.$('#crossDayCost');

      this._userCityInputGroup = _Dom.$('#userCityInputGroup');
      this._userCityAddBtn = _Dom.$('#userCityAddBtn');

      this._userSaveBtn = _Dom.$('#userSaveBtn');

    },
    bindEvent: function() {
      var me = this;
      this._userBackBtn.addEventListener('click', function() {
        me.back();
      });
      this._userDefaultBtn.addEventListener('click', function() {
        Data.recoveryDefaultUser();
        _Dom.tip('success', 1000);
        me.initData();
        me.getHotelList();
        me.getCityPrice();
      });
      this._userCityAddBtn.addEventListener('click', function() {
        me.addCityPrice();
      });
      this._userSaveBtn.addEventListener('click', function() {
        me.save();
      });
    },
    // 初始化数据
    initData: function() {
      var tmp = Data.getUser();
      console.log(tmp);
      this._pointDate.value = tmp.point_date || '';
      this._currentDayCost.value = tmp.current_day_cost || '';
      this._crossDayCost.value = tmp.cross_day_cost || '';
    },
    back: function() {
      var me = this;
      _Dom.delClass(this._userPopup, 'show');
      window.setTimeout(function() {
        _Dom.hide(me._userPopup);
        me.home.initDate();
        me.home.getDataList();
      }, 300);
    },
    // 获取酒店列表
    getHotelList: function() {
      var me = this;
      this.hotelList = Data.getBasicHotel();
      this._tag.addTagGroup(this.hotelList);
    },
    // 城市额度 START
    // 获取城市额度列表
    getCityPrice: function() {
      this._userCityInputGroup.innerHTML = '';
      var list = Data.getCityPrice('list');
      console.log(list);
      if (list && list.length > 0) {
        for (var i = 0; i < list.length; i++) {
          this.addCityPrice(list[i]);
        }
        this.batchBindCityPriceEvent();
      } else {
        this.addCityPrice();
      }
    },
    // 新增城市额度
    addCityPrice: function(data) {
      var me = this;
      var div = document.createElement('div');
      _Dom.addClass(div, 'input');
      var str = '<div class="input-container city">';
      str += '<input type="text" placeholder="城市" value="' + (data ? (data.city) : '') + '">';
      str += '</div>';
      str += '<div class="input-container number">';
      str += '<input type="number" value="' + (data ? (data.price) : '') + '">';
      str += '</div>';
      str += '<a class="close-col icon-del active"><i class="iconfont icon-close-circle-fill"></i></a>';
      div.innerHTML = str;
      this._userCityInputGroup.appendChild(div);
      var _Dels = _Dom.$('a', this._userCityInputGroup);
      _Dels[_Dels.length - 1].addEventListener('click', function(_el) {
        me.delCityPrice(_el.target.parentNode.parentNode);
      });
    },
    //批量绑定城市额度删除
    batchBindCityPriceEvent: function() {
      var me = this;
      var _Dels = _Dom.$('a', this._userCityInputGroup);
      for (var i = 0; i < _Dels.length; i++) {
        _Dels[i].addEventListener('click', function(_el) {
          me.delCityPrice(_el.target.parentNode.parentNode);
        });
      }
    },
    // 删除城市额度
    delCityPrice: function(_el) {
      this._userCityInputGroup.removeChild(_el);
    },
    // 城市额度 END
    save: function() {
      if (this._pointDate.value < 0 || this._pointDate.value > 31) {
        _Dom.tip('normal', 1000, '每月起止日期的范围是：0-31');
        return;
      }
      var params = {
        point_date: Number(this._pointDate.value) || 0,
        current_day_cost: Number(this._currentDayCost.value) || 0,
        cross_day_cost: Number(this._crossDayCost.value) || 0,
        hotel: this.hotelList || [],
        cityPrice: []
      };
      var _cityPrices = _Dom.$('.input', this._userCityInputGroup);
      for (var j = 0; j < _cityPrices.length; j++) {
        var city = _Dom.$('.city input', _cityPrices[j])[0].value;
        var price = _Dom.$('.number input', _cityPrices[j])[0].value;
        if (city && price) {
          params.cityPrice.push({
            city: city || '',
            price: price || ''
          });
        }
      }
      console.log(params);
      Data.saveUser(params);
      _Dom.tip('success', 1000);
      this.back();
    }
  };
  return User;
})();
