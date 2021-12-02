// 首页
var Home = (function() {
  function Home() {}
  Home.prototype = {
    // 初始化
    init: function() {
      //绑定DOM
      this.bindDom();
      // 绑定事件
      this.bindEvent();
      // //绑定首次
      // this.bindTasks();
    },
    searchData: function(name) {

    },
    //绑定DOM
    bindDom: function() {
      this._homePage = _Dom.$('#homePage');
      this._editPopup = _Dom.$('#editPopup');
      this._homeAddBtn = _Dom.$('#homeAddBtn');
    },
    bindNum: function() {
      var allNum = 0;
      var me = this,
        a = me.classicDom.querySelectorAll('.h-classic a');
      for (var i = 0; i < a.length; i++) {
        var search = me.searchData(a[i].querySelector('span').innerHTML);
        Tasks.prototype.init(search.index, search.tasks);
        var num = me.tasks.bindNum(a[i].parentNode.parentNode);
        console.log('num=' + num);
        allNum += num;
        a[i].querySelector('.id-list').innerHTML = num;
      }
      return allNum;
    },
    //绑定事件
    bindEvent: function() {
      var me = this;
      this._homeAddBtn.addEventListener('click', function() {
        me._editPopup.style.display = 'block';
        window.setTimeout(function() {
          _Dom.addClass(me._editPopup, 'show');
        }, 0);
        me.edit = new Edit();
        me.edit.init(me, me._editPopup);
      });
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
  }
  return Home;
})();
