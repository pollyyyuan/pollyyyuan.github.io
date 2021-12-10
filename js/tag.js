// 酒店tag
var Tag = (function() {
  function Tag(tagGroup, type, callback) {
    this.type = type;

    this._tagGroup = tagGroup;
    this.callback = callback;

    // 初始化数据
    this.tagList = '';
    this.selected = '';
  }
  Tag.prototype = {
    // 添加tag组
    addTagGroup: function(list) {
      var me = this;
      this.tagList = list;
      this.initTagGroup();
      for (var i = 0; i < list.length; i++) {
        var val = list[i];
        this.addTag(val, 'init');
      }
      this.addTagEvent();
      this._custom = _Dom.$('.input-container input', this._tagGroup)[0];
      this._custom.addEventListener('blur', function(_el) {
        me.customTag(_el.target.value);
      });
    },
    // 初始化Tag组
    initTagGroup: function() {
      this._tagGroup.innerHTML = '<div class="tag input-container"><input type="text" placeholder="自定义"></div>';
    },
    // 新增Tag
    addTag: function(val, state) {
      var me = this;
      if (!val) return;
      var div = document.createElement('div');
      div.className = 'tag';
      div.innerHTML = '<span>' + val + '</span>' + (this.type ? '<a class="btn icon-btn icon-del close-btn active"><i class="iconfont icon-close-circle-fill"></i></a>' : '');
      var last = this._tagGroup.lastChild;
      this._tagGroup.insertBefore(div, last);
      if (state === 'custom') {
        this._tags = _Dom.$('.tag:not(.input-container)', this._tagGroup);
        this._tags[this._tags.length - 1].addEventListener('click', function(_el) {
          var span = _Dom.$('span', _el.target);
          if (span.length === 0) {
            span = _Dom.$('span', _el.target.parentNode);
          }
          var val = span[0].innerHTML;
          me.selected = val;
          me.call();
          me.switchTag();
        });
        if (this.type) {
          this._dels = _Dom.$('.close-btn', this._tagGroup);
          this._dels[this._dels.length - 1].addEventListener('click', function(_el) {
            me.tagList.splice(me._dels.length, 1);
            me._tagGroup.removeChild(_el.target.parentNode.parentNode);
            me.call();
          });
        }
      }
    },
    // 绑定tag事件
    addTagEvent: function() {
      var me = this;
      if (this.type) {
        this._dels = _Dom.$('.close-btn', this._tagGroup);
        for (var i = 0; i < this._dels.length; i++) {
          this._dels[i].addEventListener('click', function(_el) {
            var tag = _el.target.parentNode.parentNode;
            var find = me.tagList.findIndex(function(val) {
              return val === _Dom.$('span', tag)[0].innerHTML;
            });
            if (find > -1) {
              me.tagList.splice(find, 1);
              me._tagGroup.removeChild(tag);
              me.call();
            }
          });
        }
      } else {
        this._tags = _Dom.$('.tag:not(.input-container)', this._tagGroup);
        for (var j = 0; j < this._tags.length; j++) {
          this._tags[j].addEventListener('click', function(_el) {
            var span = _Dom.$('span', _el.target);
            if (span.length === 0) {
              span = _Dom.$('span', _el.target.parentNode);
            }
            console.log(span);
            var val = span[0].innerHTML;
            if (me.selected === val) {
              me.selected = '';
              _Dom.delClass(val, 'selected');
            } else {
              me.selected = val;
              me.switchTag();
              me.call();
            }
          }, true);
        }
      }
    },
    // 切换tag
    switchTag: function() {
      var me = this;
      for (var i = 0; i < this._tags.length; i++) {
        var _el = _Dom.$('span', this._tags[i])[0];
        console.log(_el);
        if (_el.innerHTML === this.selected) {
          _Dom.addClass(this._tags[i], 'selected');
        } else {
          _Dom.delClass(this._tags[i], 'selected');
        }
      }
    },
    // 自定义
    customTag: function(val) {
      var me = this;
      if (val) {
        var find = this.tagList.findIndex(function(check) {
          return check === val;
        });
        if (find === -1) {
          me.addTag(val, 'custom');
          if (!me.type) {
            me.selected = val;
            me.switchTag();
          }
          me.tagList.push(val);
          me.call();
        }
        this._custom.value = '';
      }
    },
    call: function() {
      this.callback({
        tagList: this.tagList,
        selected: this.selected
      });
    },
    select: function(selected) {
      this.selected = selected;
      this.switchTag();
    }
  };
  return Tag;
})();
