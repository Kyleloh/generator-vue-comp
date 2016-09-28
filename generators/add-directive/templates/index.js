
import Vue from 'vue';
import _assign from 'lodash-es/assign';

Vue.directive('<%= directiveName %>', {
  bind() {
    
  },
  update(options) {
    var defOptions = {
      msg: 'Hello', // TODO 修改成实际的参数名
    };

    options = _assign(defOptions, options);

    this.el.innerText = options.msg; // TODO 修改成实际的逻辑
  },
  unbind() {

  }
});