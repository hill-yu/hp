<script setup>
import { ref, computed } from 'vue'
import { importImg, formatNumber } from '@/utils/utils'
const imgObj = {
  coinIconUrl: importImg('image/exchange/coinIcon.png'),
  bgLightMoneyImg: importImg('image/exchange/lightMoney.png'),
  imgUrl: importImg('image/exchange/touchGo.png'),
  onceIcon: importImg('image/exchange/once-icon.png'),
}
const emit = defineEmits(['clickCard'])

const props = defineProps({
  obj: {
    type: Object
  },
  data: {
    type: Object
  }
})
// 排序
const data = computed(() => {
  return props.data.sort((a, b) => {
    return a.exchange_amount - b.exchange_amount
  })
})
// 动态样式
const dynamicStyle = {
  '--bg-color': `${props.obj.bgColor}`,
  '--bg-light-money-img': `url(${imgObj.bgLightMoneyImg})`,
  width: '42vw'
}

function clickCard(id, obj, item) {
  emit('clickCard', id, obj, item)
}
</script>
<template>
  <div class="container">
    <!-- 滑块 -->
    <h3>{{ $t('exchange.amount.title') }}</h3>
    <div class="content">
      <ul class="my-swipe">
        <li :style="dynamicStyle" v-for="(item, index) in data" :key="index"
          @click="clickCard(item.id, props.obj, item)">
          <p class="onceLabel" v-if="item.exchange_type == 1">{{ $t('exchange.amount.content') }}</p>
          <span>{{ item.exchange_currency }} {{ item.exchange_amount }}</span>
          <div>
            <van-image width="3.5vw" height="1.6vh" lazy-load :src="imgObj.coinIconUrl" />
            <span>-{{ formatNumber(item.asset_amount) }}</span>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>
<style scoped>
.container {
  margin-top: 2vh;

  >h3 {
    position: relative;
    font-size: 4.1vw;
    padding-left: 2vw;
    color: #333333;

    &::before {
      content: '';
      display: inline-block;
      width: 1vw;
      height: 1.6vh;
      background: #50CA01;
      border-radius: 1px;
      position: absolute;
      top: 0.8vh;
      left: 0;
    }
  }

  .content {
    margin-top: 1.4vh;

    .my-swipe {
      display: flex;
      flex-wrap: wrap;

      .van-swipe-item,
      >li {
        margin-right: 2vw;
        margin-top: 1vh;
        color: #fff;
        background-color: var(--bg-color);
        background-image: var(--bg-light-money-img);
        background-size: contain;
        background-position: center;
        background-repeat: no-repeat;
        width: 42vw;
        height: 11vh;
        border-radius: 1.8vw;
        text-align: center;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        position: relative;

        >span {
          margin-top: 1vh;
          display: inline-block;
          font-weight: bold;
          font-size: 4.8vw;
          text-shadow: 0px 3px 4px rgba(155, 80, 0, 0.7);
        }

        >div {
          background: linear-gradient(0deg, #48b701 0%, #6fd91a 100%);
          border-radius: 1.8vw;
          border: 1px solid #000000;
          font-weight: bold;
          font-size: 3.4vw;
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;

          >span {
            margin-left: 0.5vw;
          }
        }

        .onceLabel {
          width: 90%;
          background: url('@/assets/image/exchange/once-icon.png') no-repeat center / contain;
          padding: 1vh 1vw;
          font-size: 3.5vw;
          font-weight: normal;
          color: #FFFFFF;
          position: absolute;
          top: -1.5vh;
          left: 1.5vw;
          line-height: 1vh;
        }
      }
    }

  }
}
</style>
