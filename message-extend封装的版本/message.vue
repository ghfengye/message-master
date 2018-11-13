<template>
    <transition name="custom-classes-transition" :enter-active-class="enterActiveClass" :leave-active-class="leaveActiveClass">
        <div :class="['message-container']" v-if="isShow">
            <div :class="['message-content',options['closable']?'message-closable':'']" ref="content" :style="styles">
                <div class="message-content-text" v-if="['content']">
                    <div class="message-custom-content">
                        <i :class="['iconfont',options['type']||'info']" v-html="iconType"></i>
                        <span>{{options['content'] || ''}}</span>
                    </div>
                </div>
                <a class="message-icon-close" @click="close" v-if="options['closable']"><i class="iconfont icon-close">&#xe612;</i></a>
            </div>
        </div>
    </transition>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { setToPx } from '@utils/dom';

@Component
export default class Message extends Vue {
  isShow: Boolean = false; //显示提示框
  options = {
    type: 'info', //提示框类型
    content: 'This is a tip', //提示框内容
    closable: false, //是否可手动关闭
    onClose( ){}, //关闭操作
    duration: 3.5, //单位s 延迟多少秒后关闭
    position: 't', //提示框的默认位置
    top: '',
    bottom: '',
    right: '',
    left: ''
  };
  enterActiveClass: string = ''; //进入动画的样式
  leaveActiveClass: string = ''; //离开动画的样式
  styles = {};
  get iconType() {
    let iconTypes = {
      //icon类型
      info: '&#xe832;',
      success: '&#xe6c3;',
      warning: '&#xe6c6;',
      error: '&#xe6cb;'
    };
    return iconTypes[this.options['type']] || '&#xe832;';
  }
  beforeDestroy() {
    this.clearCloseTimer();
  }
  clearCloseTimer() {
    if (this['closeTimer']) {
      clearTimeout(this['closeTimer']);
      this['closeTimer'] = null;
    }
  }
  /**获取样式 */
  setStyles() {
    let ret = {};
    let _position = this.getPosition();
    ret = { ...ret, ..._position };
    return ret;
  }
  /**获取定位 */
  getPosition() {
    let _position = {};
    let { left, right, top, bottom } = this.options;
    //可选择默认的定位模式
    switch (this.options.position) {
      case 'auto': //水平垂直居中
        _position['left'] = '50%';
        _position['top'] = '50%';
        _position['transform'] = 'translate(-50%,-50%)';
        if (left || right || top || bottom) {
          delete _position['transform'];
        }
        break;
      case 't': //上,水平居中
        _position['top'] = '0';
        _position['left'] = '50%';
        _position['transform'] = 'translateX(-50%)';
        if (left || right) {
          delete _position['transform'];
        }
        break;
      case 'l': //左，垂直居中
        _position['left'] = '0';
        _position['top'] = '50%';
        _position['transform'] = 'translateY(-50%)';
        if (top || bottom) {
          delete _position['transform'];
        }
        break;
      case 'r': //右，垂直居中
        _position['left'] = 'auto';
        _position['right'] = '0';
        _position['top'] = '50%';
        _position['transform'] = 'translateY(-50%)';
        if (top || bottom) {
          delete _position['transform'];
        }
        break;
      case 'b': //下，水平居中
        _position['bottom'] = '0';
        _position['top'] = 'auto';
        _position['left'] = '50%';
        _position['transform'] = 'translateX(-50%)';
        if (left || right) {
          delete _position['transform'];
        }
        break;
      case 'lt': //左上角
        _position['top'] = '0';
        _position['left'] = '0';
        break;
      case 'lb': //左下角
        _position['top'] = 'suto';
        _position['bottom'] = '0';
        _position['left'] = '0';
        break;
      case 'rt': //右上角
        _position['top'] = '0';
        _position['left'] = 'auto';
        _position['right'] = '0';
        break;
      case 'rb': //右下角
        _position['top'] = 'suto';
        _position['bottom'] = '0';
        _position['left'] = 'auto';
        _position['right'] = '0';
        break;
      default:
        //默认上 水平居中
        _position['top'] = '0';
        _position['left'] = '50%';
        _position['transform'] = 'translateX(-50%)';
        if (left || right) {
          delete _position['transform'];
        }
    }
    //左右/上下互斥，当同时设置了左右、上下，则默认左/上
    if (bottom) {
      _position = { ..._position, ...{ bottom, top: 'auto' } };
    }
    if (top) _position = { ..._position, ...{ top, bottom: 'auto' } };
    if (right) _position = { ..._position, ...{ right, left: 'auto' } };
    if (left) _position = { ..._position, ...{ left, right: 'auto' } };
    return _position;
  }
  /**获取动画样式 */
  getAnimateClass() {
    let enterclass = '';
    let leaveclass = '';
    let position = this.options['position'];
    if (position === 't') {
      enterclass = 'fadeInDown';
      leaveclass = 'fadeOutUp';
    } else if (position === 'b') {
      enterclass = 'fadeInUp';
      leaveclass = 'fadeOutDown';
    } else if (position === 'l' || position === 'lt' || position === 'lb') {
      enterclass = 'fadeInLeft';
      leaveclass = 'fadeOutLeft';
    } else if (position === 'r' || position === 'rt' || position === 'rb') {
      enterclass = 'fadeInRight';
      leaveclass = 'fadeOutRight';
    } else {
      enterclass = 'fadeInDown';
      leaveclass = 'fadeOutUp';
    }
    this.enterActiveClass = 'animated '.concat(enterclass);
    this.leaveActiveClass = 'animated '.concat(leaveclass);
  }
  /**关闭 */
  close() {
    this.clearCloseTimer();
    this.isShow = false;
    this.options.onClose();
  }
  /**打开提示框 */
  config(options = {}) {
    this.clearCloseTimer();
    this.options = { ...this.options, ...options };
    this.getAnimateClass();
    this.styles = { ...this['setStyles']() };
    this.isShow = true;
    //自动关闭
    if (!this.options['closable']) {
      if (this.options['duration'] !== 0) {
        this['closeTimer'] = setTimeout(() => {
          this.close();
        }, this.options['duration'] * 1000);
      }
    }
  }
}
</script>
<style lang="scss" scoped>
@import "~@scss/mixin.scss";
/** message样式*/
.message-container {
  position: fixed;
  left: 0;
  top: 0;
  z-index: 9999;
  width: 100%;
  height: 100%;
  point-event:none; //修复遮罩层挡住页面的交互

  .message-content {
    display: inline-block;
    pointer-events: all;
    padding: 8px 16px;
    border-radius: 4px;
    -webkit-box-shadow: 0 1px 6px rgba(0, 0, 0, 0.2);
    box-shadow: 0 1px 6px rgba(0, 0, 0, 0.2);
    background: #fff;
    position: absolute;

    .message-content-text {
      display: inline-block;

      .message-custom-content {
        font-size: 14px;

        .iconfont {
          margin-right: 10px;

          &.info {
            color: #2d8cf0;
          }

          &.warning {
            color: $color-info;
          }

          &.success {
            color: $color-tips;
          }

          &.error {
            color: $color-danger;
          }
        }
      }
    }

    .message-icon-close {
      position: absolute;
      right: 4px;
      top: 10px;
      color: #999;
      outline: 0;
      cursor: pointer;
      transition: color 0.2s ease;
      text-decoration: none;

      .icon-close {
        font-size: 10px;
        color: #999;
        transition: color 0.2s ease;
        margin-right: 4px;
        vertical-align: middle;
      }
    }
  }

  .message-closable {
    .message-content-text {
      padding-right: 32px;
    }
  }
}
</style>