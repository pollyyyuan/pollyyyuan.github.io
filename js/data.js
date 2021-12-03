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
 *      list:[{
 *         vehicle:@交通工具,
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
 *  _limemo_common // 常用数据
 *  {
 *      current_month_start: @当月开始天数,
 *      current_month_end: @当月结束天数,
 *      leave: @出发地,
 *      arrive: @到达地,
 *      show_detail: @是否显示明细
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
  // 基础资料-交通-获取
  getBasicVehicle: function() {

  },
  // 基础资料-花销-获取
  getBasicCost: function() {

  },
  // 天-获取-根据月份
  getDayListByMonth: function(month) {
    var list = this.get('_limemo_data_' + month);
    var dayList = [];
    for (var i = 0; i < list.length; i++) {
      dayList.push(new Date(list[i].date).getDate());
    }
    return dayList || [];
  },
  // 数据-获取-根据月份
  getDataListByMonth: function(month) {
    var list = this.get('_limemo_data_' + month);
    return list || [];
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
        idx = 0;
        for (var i = 0; i < list.length; i++) {
          var tmpMonth = new Date(list[i].date).getMonth() + 1;
          if (month < tmpMonth) {
            idx = i;
            break;
          }
        }
        list.splice(idx, 0, data);
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
