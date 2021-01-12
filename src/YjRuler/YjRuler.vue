<template>
  <div class="yj-ruler" :style="{width: width + 'px'}">
    <div id="yj-ruler-scroll" class="content">
      <canvas id="yj-ruler-canvas" />
    </div>
    <div class="ruler-line-active" :style="{left: lineActiveLeft + 'px', 'background-color': color}"></div>
    <img src="./images/mask_left@2x.png" class="mask-left" alt />
    <img src="./images/mask_right@2x.png" class="mask-right" alt />
  </div>
</template>

<script>
export default {
  name: 'YjRuler',
  props: {
    width: {
      type: Number,
      default: 375,
    },
    color: {
      type: String,
      default: '#0ec68b',
    },
    maxValue: {
      type: Number,
      default: 30000,
    },
    minValue: {
      type: Number,
      default: 1000,
    },
    defaultValue: {
      type: Number,
      default: 6000,
    },
    intervalSmall: {
      // 低刻度间隔
      type: Number,
      default: 200,
    },
    intervalBig: {
      // 高刻度间隔
      type: Number,
      default: 1000,
    },
    rulerChangeCallback: {
      type: Function,
    },
  },
  data() {
    return {
      lineActiveLeft: this.width / 2 - 3, // 高亮线左边距
      leftSpace: this.width / 2, // 左边空白
      rightSpace: this.width / 2, // 右边空白
      intervalPXBig: (this.intervalBig / this.intervalSmall) * 10, // 高刻度像素间隔
      intervalPXSmall: 10, // 低刻度像素间隔
      canvasWidth: 0, // 画布宽度
      touched: false, // 用于最后判断刻度没有在线上时移动
    }
  },
  watch: {
    defaultValue() {
      this.setDefaultValue()
    }
  },
  mounted() {
    // 开始绘制标尺
    this.startDraw()
  },
  methods: {
    startDraw() {
      this.canvasWidth =
        ((this.maxValue - this.minValue) / this.intervalBig) * this.intervalPXBig +
        this.leftSpace +
        this.rightSpace
      const canvas = document.getElementById('yj-ruler-canvas')
      if (!canvas) {
        return
      }
      canvas.setAttribute('width', this.canvasWidth)
      canvas.setAttribute('height', 78)
      const ctx = canvas.getContext('2d')

      const width = canvas.width
      const height = canvas.height
      let devicePixelRatio = null
      if (window.devicePixelRatio) {
        devicePixelRatio = window.devicePixelRatio
        canvas.style.width = width + 'px'
        canvas.style.height = height + 'px'
        canvas.height = height * devicePixelRatio
        canvas.width = width * devicePixelRatio
        ctx.scale(devicePixelRatio, devicePixelRatio)
      }

      for (let i = 0; i <= (this.maxValue - this.minValue) / this.intervalBig; i++) {
        this.drawLine(
          ctx,
          '#e4e4e4',
          this.leftSpace + i * this.intervalPXBig,
          16,
          this.leftSpace + i * this.intervalPXBig,
          60,
          3
        )
        this.drawText(
          ctx,
          '#e4e4e4',
          1000 + i * this.intervalBig,
          this.leftSpace + i * this.intervalPXBig - 20,
          75
        )
      }

      for (let i = 0; i <= (this.maxValue - this.minValue) / this.intervalSmall; i++) {
        this.drawLine(
          ctx,
          '#e4e4e4',
          this.leftSpace + i * this.intervalPXSmall,
          36,
          this.leftSpace + i * this.intervalPXSmall,
          60,
          3
        )
      }

      this.setDefaultValue()
    },
    // 绘制文字
    drawText(ctx, color, text, x1, y1) {
      ctx.fillStyle = color
      ctx.font = '14px normal PingFang SC'
      ctx.fillText(text, x1, y1)
    },
    // 绘制刻度线
    drawLine(ctx, color, x1, y1, x2, y2, lineWidth) {
      ctx.beginPath()
      ctx.lineWidth = lineWidth
      ctx.lineCap = 'round'
      ctx.moveTo(x1, y1)
      ctx.lineTo(x2, y2)
      ctx.strokeStyle = color
      ctx.stroke()
      ctx.closePath()
    },
    // 设置默认值
    setDefaultValue() {
      const rulerScroll = document.getElementById('yj-ruler-scroll')
      const left = ((this.defaultValue - this.minValue) / this.intervalSmall) * this.intervalPXSmall
      rulerScroll.scrollTo(left, 0)

      this.$nextTick(() => {
        this.onChangeListener()
      })
    },
    // 监听刻度变化
    onChangeListener() {
      const rulerScroll = document.getElementById('yj-ruler-scroll')
      rulerScroll.addEventListener('touchstart', (e) => {
        this.touched = true
      })
      rulerScroll.addEventListener('touchend', (e) => {
        this.touched = false
        this.changeRulerPosition(rulerScroll)
      })
      rulerScroll.addEventListener('touchmove', (e) => {
        this.touched = true
      })
      rulerScroll.addEventListener('scroll', (e) => {
        // TODO: 节流？？？
        this.changeRulerPosition(rulerScroll)
      })
    },
    // 改变刻度位置
    changeRulerPosition(rulerScroll) {
      let left = 0
      if (rulerScroll.scrollLeft % 10 >= 5) {
        // 刻度线中线右侧
        left = (Math.floor(rulerScroll.scrollLeft / 10) + 1) * 10
      } else {
        // 刻度线中线左侧
        left = Math.floor(rulerScroll.scrollLeft / 10) * 10
      }
      console.log('scroll', rulerScroll.scrollLeft, left)
      // touched为false，则移动标尺到刻度线上
      if (!this.touched) {
        rulerScroll.scrollTo(left, 0)
      }
      this.$emit('rulerChangeCallback', (left / 10) * this.intervalSmall + this.minValue)
    },
    // 节流
    throttle(func, delay) {
      let timer = null
      return function () {
        let context = this
        let args = arguments
        if (!timer) {
          timer = setTimeout(function () {
            func.apply(context, args)
            timer = null
          }, delay)
        }
      }
    },
  },
}
</script>

<style lang="less" scoped>
.yj-ruler {
  position: relative;
  background-color: white;
  margin: 0 auto;
  .content {
    width: 100%;
    margin: 0 auto;
    display: flex;
    position: relative;
    overflow-x: auto;
    overflow-y: hidden;
  }
  .content::-webkit-scrollbar {
    display: none; /* Chrome Safari */
  }
  .ruler-line-active {
    width: 6px;
    height: 63px;
    background-color: #0ec68b;
    position: absolute;
    top: 0px;
    z-index: 99;
    border-radius: 3px 3px 3px 3px;
  }
  .mask-left {
    width: 53px;
    height: 100%;
    position: absolute;
    bottom: 0;
    left: 0;
    z-index: 99;
    pointer-events: none;
  }
  .mask-right {
    width: 53px;
    height: 100%;
    position: absolute;
    bottom: 0;
    right: 0;
    z-index: 99;
    pointer-events: none;
  }
}
</style>
