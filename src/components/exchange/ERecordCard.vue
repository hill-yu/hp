<script setup>
import { importImg, formatNumber, formatDate } from '@/utils/utils'
const imgObj = {
  // touchGoUrl: importImg('image/exchange/touchGo.png'),
  coinIconUrl: importImg('image/exchange/coinIcon.png')
}
const props = defineProps({
  obj: {
    type: Object
  },
  estimated_currency: {
    type: String
  }
})
</script>
<template>
  <div class="container">
    <!-- 头部信息 -->
    <h3 v-if="obj.trade_status == 0 || obj.trade_status == 1">{{ $t('exchange.record.status_pending') }}</h3>
    <h3 v-else-if="obj.trade_status == 2" style="background: #50ca01">
      {{ $t('exchange.record.status_success') }} -
      <span>{{ formatDate(obj.trade_time) }}</span>
    </h3>
    <h3 v-else style="background: #ff6d26">
      {{ $t('exchange.record.status_fail') }} -
      <span>{{ formatDate(obj.trade_time) }}</span>
    </h3>
    <div class="content">
      <!-- 主体信息 -->
      <div class="info">
        <div>
          <p>
            <van-image width="5vw" height="2.3vh" fit="cover" lazy-load :src="obj.payout_target_icon" />
            <span>{{ obj.payout_target_name }}</span>
          </p>
          <span>{{ formatDate(obj.trade_time) }}</span>
        </div>
        <div>
          <span>{{ props.estimated_currency }} {{ obj.trade_amount }}</span>
          <p>
            <van-image width="3.5vw" height="1.6vh" lazy-load :src="imgObj.coinIconUrl" />
            <span>-{{ formatNumber(obj.trade_asset_amount) }}</span>
          </p>
        </div>
      </div>
      <!-- 提示 -->
      <div class="tip">
        <div v-if="obj.trade_status == 0 || obj.trade_status == 1" v-html="$t('exchange.record.status_pending_tip')">
        </div>
        <div v-else-if="obj.trade_status == 2" v-html="$t('exchange.record.status_success_tip')"></div>
        <div v-else style="color: #e26223" v-html="$t('exchange.record.status_fail_tip')">
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.container {
  border-radius: 3vw;
  border: 1px solid #999;
  margin-bottom: 1.4vh;
  background-color: #fff;

  h3 {
    border-radius: 3vw 3vw 0 0;
    font-size: 4.4vw;
    color: #fefefe;
    padding-left: 3.2vw;
    line-height: 3.3vh;
    background: #2385f4;

    span {
      font-size: 3vw;
    }
  }

  .content {
    padding: 1.6vh 3.2vw;

    .info {
      border-bottom: 1px solid #ededed;
      padding-bottom: 1.4vh;
      margin-bottom: 1.4vh;

      >div {
        display: flex;
        justify-content: space-between;
        align-items: center;
        color: #666666;

        >p {
          display: flex;
          align-items: center;

          >span {
            font-size: 4.6vw;
            margin-left: 2vw;
          }
        }

        >span {
          font-size: 3.5vw;
        }
      }

      >div:nth-child(2) {
        >span {
          font-size: 5.6vw;
          color: #333;
          font-weight: bold;
        }

        >p {
          background: linear-gradient(0deg, #48b701 0%, #6fd91a 100%);
          border-radius: 1.8vw;
          border: 1px solid #000000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 2vw;

          >span {
            font-weight: bold;
            font-size: 3.4vw;
            color: #ffffff;
            margin-left: 0.5vw;
          }
        }
      }
    }

    .tip {
      font-size: 3.7vw;
      color: #666666;
    }
  }
}
</style>
