import MessageBase from '@components/message/message.vue'
import Vue from 'vue';

//创建message实例
MessageBase.newInstance = properties => {
  const _props = properties || {};
  const Instance = new Vue({
    render(h) {
      return h(MessageBase, {
        props: _props
      });
    }
  });
  const component = Instance.$mount();
  document.body.appendChild(component.$el);
  const instance = Instance.$children[0];
  instance['isShow'] = true;

  return {
    close() {
      instance.close();
    },
    component: instance
  }
}


const iconTypes = { //icon类型
  'info': '&#xe832;',
  'success': '&#xe6c3;',
  'warning': '&#xe6c6;',
  'error': '&#xe6cb;'
};
let messageInstance;

export default {
  name: 'Message',

  open(options) {
    if (typeof options === 'string') {
      options = {
        content: options
      };
    }
    messageInstance = MessageBase.newInstance({
      ...options,
      content: `<div class="message-custom-content message-error">
          <i class = "iconfont ${options['type']||'info'}"> ${ iconTypes[options['type']||'info'] } </i>
          <span>${options.content || ''}</span>
        </div>
      </div>`
    })
  },
  close() {
    messageInstance.close();
  }
}