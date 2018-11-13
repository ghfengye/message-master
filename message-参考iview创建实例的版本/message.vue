<template>

  <transition name="custom-classes-transition" enter-active-class="animated fadeInDown " leave-active-class="animated fadeOutUp">
    <div :class="['message-container']" v-if="isShow">
      <div :class="['message-content',closable?'message-closable':'']" ref="content" :style="setStyles()">
        <div class="message-content-text" v-html="content">
        </div>
        <a class="message-icon-close" @click="close" v-if="closable"><i class="iconfont icon-close">&#xe612;</i></a>
      </div>
    </div>
  </transition>
</template>
<script lang="ts" scoped>
  import { Component, Vue, Prop } from "vue-property-decorator";
  import {
    setToPx
  } from '@utils/dom';
  @Component
  export default class Message extends Vue {
    isShow: Boolean = false;
    @Prop({
      default: `<div class="message-custom-content message-error">
  <i class="iconfont">&#xe6bc;</i>
  <span>This is a success tip</span>
</div>
</div>`
    })
    content!: String;

    @Prop({
      default: false
    })
    closable!: Boolean; //是否可手动关闭

    @Prop({
      default: function() {
        return () => {};
      }
    })
    onClose!: Function; //关闭操作

    @Prop({
      default: 3
    })
    duration!: Number; //单位s

    @Prop({
      default: 300
    }) width!: Number;

    @Prop({
      default: 'auto'
    }) position!: String;

    @Prop() top!: String;
    @Prop() bottom!: String;
    @Prop() right!: String;
    @Prop() left!: String;

    setStyles() {
      let ret = {};
      ret['width'] = setToPx(this.width);
      let _position = this.getPosition();
      ret = { ...ret, ..._position };
      console.log(ret)
      return ret;
    }

    getPosition() {
      let _position = {};
      //可选择默认的定位模式
      switch (this.position) {
        case 'auto': //水平垂直居中
          _position['left'] = '50%';
          _position['top'] = '50%';
          _position['transform'] = 'translate(-50%,-50%)';
          break;
        case 'top': //上
          _position['top'] = '0';
          _position['left'] = '50%';
          _position['transform'] = 'translateX(-50%)';
          break;
        case 'left': //左
          _position['left'] = '0';
          _position['top'] = '50%';
          _position['transform'] = 'translateY(-50%)';
          break;
        case 'right': //右
          _position['left'] = 'auto';
          _position['right'] = '0';
          _position['top'] = '50%';
          _position['transform'] = 'translateY(-50%)';
          break;
        case 'bottom': //下
          _position['bottom'] = '0';
          _position['top'] = 'auto';
          _position['left'] = '50%';
          _position['transform'] = 'translateX(-50%)';
          break;
        case 'leftTop': //左上角      
          _position['top'] = '0';
          _position['left'] = '0';
          break;
        case 'leftBottom': //左下角
          _position['top'] = 'suto';
          _position['bottom'] = '0';
          _position['left'] = '0';
          break;
        case 'rightTop': //右上角
          _position['top'] = '0';
          _position['left'] = 'auto';
          _position['right'] = '0';
          break;
        case 'rightBottom': //右下角
          _position['top'] = 'suto';
          _position['bottom'] = '0';
          _position['left'] = 'auto';
          _position['right'] = '0';
          break;
        default: //默认垂直水平居中
          _position['left'] = '50%';
          _position['top'] = '50%';
          _position['transform'] = 'translate(-50%,-50%)';
      }
      //如果设置了position，同时又设置了水平和垂直方向，则默认为自定义定位，不默认设置
      if (((this['top'] && this['left']) || (this['top'] && this['right']) || (this['bottom'] && this['left']) || (this['bottom'] && this['right'])) && this['position']) {
        _position = {};
      }
      //左右/上下互斥，当同时设置了左右、上下，则默认左/上
      if (this['bottom']) _position = { ..._position, ...{ 'bottom': this['bottom'], 'top': 'auto' } };
      if (this['top']) _position = { ..._position, ...{ 'top': this['top'], 'bottom': 'auto' } };
      if (this['right']) _position = { ..._position, ...{ 'right': this['right'], 'left': 'auto' } };
      if (this['left']) _position = { ..._position, ...{ 'left': this['left'], 'right': 'auto' } };

      return _position;
    }

    close() {
      this.clearCloseTimer();
      this.isShow = false;
      this.onClose();
    }

    clearCloseTimer() {
      if (this["closeTimer"]) {
        clearTimeout(this["closeTimer"]);
        this["closeTimer"] = null;
      }
    }
    mounted() {
      this.clearCloseTimer();
      //自动关闭
      if (!this.closable) {
        if (this.duration !== 0) {
          this["closeTimer"] = setTimeout(() => {
            this.close();
          }, this.duration * 1000);
        }
      }
    }
    beforeDestroy() {
      this.clearCloseTimer();
    }
  }
</script>
<style lang="scss">
  @import "~@scss/mixin.scss";

  .message-container {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 9999;
    width: 100%;
    height: 100%;
  }

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
</style>