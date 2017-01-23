
import Vue from 'vue';
import _assign from 'lodash-es/assign';

Vue.directive('<%= directiveName %>', {
  bind(el, binding) {
    var defOptions = {
      msg: 'Hello', // TODO 修改成实际的参数名
    };

    var options = _assign(defOptions, binding.value);

    el.innerText = options.msg; // TODO 修改成实际的逻辑
  },
  unbind() {

  }
});
