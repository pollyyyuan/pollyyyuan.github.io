// 数据处理
// 存储方式：localstorage
/* 数据结构：
 *  key ：关键字（_limemo）+ "_" + @表名 + "_" + @月份
 *  _limemo_data_@月份 // 数据
 *  [{
 *    date: @日期,
 *    work: @事务,
 *    official: @总报销金额,
 *    total: @总实际金额,
 *    contrast: @总对比,
 *    traffic: { // 交通
 *      leave: @出发地,
 *      arrive: @到达地,
 *      official: @总报销金额,
 *      total: @总实际金额,
 *       contrast: @总对比,
 *      list:[{
 *         vehicle:@交通工具,
 *         mark:@备注,
 *         official:@报销金额,
 *         total:@实际金额,
 *         contrast:@对比
 *      }]
 *    },
 *    stay: { // 住宿
 *      hotel: @酒店名称,
 *      official:@报销金额,
 *      total:@实际金额,
 *      contrast:@对比
 *    },
 *    cost: { // 花销
 *      official: @总报销金额,
 *      total: @总实际金额,
 *       contrast:@对比
 *      list:[{
 *         content:@内容,
 *         official:@报销金额,
 *         total:@实际金额,
 *         contrast:@对比
 *      }]
 *    },
 *  }]
 *  _limemo_basic_hotel // 酒店基础资料
 *  [
 *    @酒店名称
 *   ]
 *  _limemo_basic_vehicle // 交通基础资料
 *  [
 *    @交通工具
 *   ]
 *  _limemo_basic_cost // 花销基础资料
 *  [
 *    @花销内容
 *   ]
 *  _limemo_city_price // 城市住宿额度资料
 *  {
 *     @城市编号: @价格
 *   }
 *  _limemo_common // 常用数据
 *  {
 *      point_date: @每月起止日期,
 *      current_day_cost: @当天出差补贴,
 *      cross_day_cost: @跨天出差补贴
 *  }
 */
var Data = {
  // 基础资料-酒店-获取
  getBasicHotel: function() {
    var list = this.get('_limemo_basic_hotel');
    if (!list) {
      this.addBasicHotel();
      this.getBasicHotel();
    } else {
      return list || [];
    }
  },
  // 基础资料-酒店-新增
  addBasicHotel: function(list) {
    list = list || ['汉庭', '全季', '橘子'];
    this.save('_limemo_basic_hotel', list);
  },
  // 基础资料-酒店-保存
  saveBasicHotel: function(list) {
    this.save('_limemo_basic_hotel', list);
  },
  // 基础资料-交通-获取
  getBasicVehicle: function() {

  },
  // 基础资料-花销-获取
  getBasicCost: function() {

  },
  // 城市住宿额度-获取
  getCityPrice: function(format) {
    var object = this.get('_limemo_city_price');
    if (format == 'list') {
      var list = [];
      for (var key in object) {
        list.push({
          city: key,
          price: object[key]
        });
      }
      return list || [];
    } else {
      return object || {};
    }
  },
  // 城市住宿额度-保存
  saveCityPrice: function(list) {
    var object = {};
    for (var i = 0; i < list.length; i++) {
      object[list[i].city] = list[i].price;
    }
    this.save('_limemo_city_price', object);
  },
  // 城市住宿额度-新增
  addCityPrice: function(list) {
    var object = {};
    this.save('_limemo_city_price', object);
  },
  // 个人中心-获取
  getUser: function(params) {
    var object = this.get('_limemo_common');
    if (!object) {
      this.addUser();
      this.getUser();
    } else {
      return object || {};
    }
  },
  // 个人中心-新增
  addUser: function(params) {
    this.save('_limemo_common', {
      point_date: 20,
      current_day_cost: 50,
      cross_day_cost: 80
    });
  },
  // 个人中心-保存
  saveUser: function(params) {
    this.save('_limemo_common', {
      point_date: params.point_date,
      current_day_cost: params.current_day_cost,
      cross_day_cost: params.cross_day_cost
    });
    this.saveBasicHotel(params.hotel);
    this.saveCityPrice(params.cityPrice);
  },
  // 个人中心- 恢复默认
  recoveryDefaultUser: function() {
    this.addUser();
    this.addBasicHotel();
    this.addCityPrice();
  },
  // 天-获取-根据月份
  getDateListByMonth: function(monthArr) {
    var list = [];
    for (var j = 0; j < monthArr.length; j++) {
      list = list.concat(this.get('_limemo_data_' + monthArr[j]) || []);
    }
    var dayList = [];
    for (var i = 0; i < list.length; i++) {
      dayList.push(list[i].date);
    }
    return dayList || [];
  },
  // 数据-获取-根据日期范围
  getDataListByDateRange: function(start, end) {
    var list = [];
    var result = [];
    var s_month = new Date(start).getMonth() + 1;
    var month = new Date(end).getMonth() + 1;
    list = this.get('_limemo_data_' + s_month) || [];
    list = list.concat(this.get('_limemo_data_' + month) || []);

    for (var i = 0; i < list.length; i++) {
      var date = list[i].date;
      if (date < end && date > start) {
        result.push(list[i]);
      }
    }
    return result || [];
  },
  // 数据-获取-根据日期
  getDataListByDate: function(date) {
    var result = {};
    var month = new Date(date).getMonth() + 1;
    var list = this.getDataListByMonth(month);
    if (list.length > 0) {
      var idx = list.findIndex(function(find) {
        return find.date === date;
      });
      if (idx > -1) {
        result = list[idx];
      }
    }
    return result;
  },
  // 数据-获取-根据月份
  getDataListByMonth: function(month) {
    var list = this.get('_limemo_data_' + month);
    return list || [];
  },
  // 数据-存储
  saveData: function(data) {
    var month = new Date(data.date).getMonth() + 1;
    var list = this.getDataListByMonth(month);
    if (list.length > 0) {
      var idx = list.findIndex(function(find) {
        return find.date === data.date;
      });
      if (idx > -1) {
        list.splice(idx, 1, data);
      } else {
        list.push(data);
        list = list.sort(function(a, b) {
          if (a.date < b.date) {
            return 1;
          } else {
            return -1;
          }
        });
        console.log(list);
      }
      this.save('_limemo_data_' + month, list);
    } else {
      this.save('_limemo_data_' + month, [data]);
    }
  },
  // 删除数据
  delData: function(date) {
    var month = new Date(date).getMonth() + 1;
    var list = this.getDataListByMonth(month);
    var tmp = this.getDataListByDate(date);
    console.log(tmp);
    if (tmp.date) {
      var idx = list.findIndex(function(find) {
        return find.date === date;
      });
      if (idx > -1) {
        list.splice(idx, 1);
        this.save('_limemo_data_' + month, list);
      }
    }
  },
  // 获取常用数据
  getCommon: function() {
    var tmp = this.get('_limemo_common');
    return tmp || {};
  },

  save: function(key, data) {
    localStorage[key] = JSON.stringify(data);
  },
  get: function(key) {
    if (localStorage[key]) {
      return JSON.parse(localStorage[key]);
    } else {
      return '';
    }
  }
};
