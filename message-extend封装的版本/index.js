  /**
   * @param options 参数:
   * type：string 提示框的类型，可选项有 消息info、成功success、警告warning、错误error,默认info;
   * content：string 提示的内容;
   * closable：boolean 是否显示手动关闭按钮，默认false;
   * onClose:function 提示框关闭后的操作
   * duration：number 单位秒 延迟多少s后关闭，默认3.5s
   * position：string  提示框的定位/动画过渡的方向，可选项 水平垂直居中 auto、 ↑并且水平居中 t、↓并且水平居中 b、←并且垂直居中→并且垂直居中 r 、左上角 lt、左下角 lb、右上角 rt、右下角 rb ，默认↑并且水平居中 t
   * left: string 自定义定位
   * top: string 
   * bottom:string
   * right:string 
   * 可以自主选择动画的何种模式，并自定义位置
   */
  import MessageComponent from '@components/message/message.vue'

  let $vm;
  export default {
    install(Vue) {
      let Message = Vue.extend(MessageComponent);
      if (!$vm) {
        $vm = new Message().$mount();
        document.body.appendChild($vm.$el);
      }
      const message = {
        info(options) {
          this.message('info', options);
        },
        success(options) {
          this.message('success', options);
        },
        warning(options) {
          this.message('warning', options);
        },
        error(options) {
          this.message('error', options);
        },
        message(type, options) {
          if (typeof options === 'string') {
            options = {
              content: options
            };
          }
          $vm.config({
            type,
            ...options
          });
        },
        close() {
          $vm.close();
        }
      }
      Vue.$messageCustom = message;
      Vue.prototype.$messageCustom = message;
    }
  }