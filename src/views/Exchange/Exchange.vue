<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { showToast } from 'vant'
import ExchangePlatform from '@/components/exchange/ExchangePlatform.vue'
import EPopup from '@/components/exchange/EPopup.vue'
import { get_game_balance } from '@/api/exchange'
import { useExchangeStore } from '@/stores/exchange'
import { useLangStore } from '@/stores/lang'
import { importImg, formatNumber, docuLocation } from '@/utils/utils'
import { ExchangeCardColor } from '@/utils/types'
const router = useRouter()
const { t, locale } = useI18n() // 获取 t 函数和 locale
const imgObj = {
  coinsUrl: importImg('image/exchange/coins.png'),
  redeemedUrl: importImg('image/exchange/redeemed.png')
}
// 加载数据
const exchange_data = ref(null)
const game_balance_data = ref(null)
const exchangeStore = useExchangeStore()
const langStore = useLangStore()
// 0:兑换协议,1:禁止兑换
const popType = ref(0)
// 是否同意兑换协议,加载来自于localstorage，默认false
const isExchangeProtocol = computed(() => {
  return exchangeStore.isExchangeProtocol
})
// payout列表
const exchangePayoutList = ref(null)
// 兑换列表
const exchangeDataByProvider = ref(null)
// 哪个payout被激活
const payoutActive = ref(null)
onMounted(async () => {
  // 加载语言
  locale.value = langStore.language
  try {
    await exchangeStore.getExchangeData()
    await get_game_balance()
      .then((result) => {
        if (result?.code == 200) {
          game_balance_data.value = result.data
          if (game_balance_data.value['user_status'] != 'enable') {
            popType.value = 1
          }
        } else {
          console.log('用户有问题');
        }
      })
      .catch((error) => {
        console.log(error)
        game_balance_data.value = {
          user_coins: 'test',
          estimated_currency: 'test',
          estimated_cash: 'test',
          total_trade_currency: 'test',
          total_trade_amount: 'test'
        }
      })
    const { exchangeDatas } = exchangeStore
    exchange_data.value = exchangeDatas
    exchangePayoutList.value = exchangeStore.exchangePayoutList()
    exchangeDataByProvider.value = exchangeStore.exchangeDataByProvider({
      title: Object.keys(exchange_data.value)[0]
    })
    console.log('exchangePayoutList', exchangePayoutList);
    console.log('exchangeDataByProvider', exchangeDataByProvider);
    payoutActive.value = Object.keys(exchange_data.value)[0]
    docuLocation('show')
  } catch (error) {
    console.log('error', error)
  }
})
const popShow = ref(false)
const detailData = ref(null)
const clickCard = (id, obj, item) => {
  // 判断金币是否足够
  if (game_balance_data.value['user_coins'] < item['asset_amount']) {
    showToast({
      message: t('exchange.coin_insufficient')
    })
    return
  }
  // popType：1,账户禁止使用
  if (popType.value == 1) {
    popShow.value = true
  } else {
    // 判断今日是否已兑换，每天只能兑换一次
    if (game_balance_data.value['is_payout_order']) {
      showToast({
        message: t('exchange.is_exchange_tip')
      })
      return
    }
    // 代表已经同意兑换协议，会直接跳转至详情页面
    if (JSON.parse(isExchangeProtocol.value)) {
      // isExchangeProtocol.value转成布尔类型进行判断
      router.push({
        name: 'exchangeDetail',
        query: {
          data: JSON.stringify({
            id: id,
            ...obj
          })
        }
      })
    } else {
      // 代表还没有同意兑换协议，会弹窗显示兑换协议
      detailData.value = {
        id: id,
        ...obj
      }
      popShow.value = true
    }
  }
}
// 定义跳转路由至兑换详情页
const goToDetail = () => {
  exchangeStore.setIsExPro()
  router.push({
    name: 'exchangeDetail',
    query: {
      data: JSON.stringify(detailData.value)
    }
  })
}
// 跳转路由至兑换记录页
const goToRecord = () => {
  router.push({
    name: 'exchangeRecord',
    query: { estimated_currency: game_balance_data.value['estimated_currency'] }
  })
}
// 切换payout事件
const switchPayout = (payoutName) => {
  payoutActive.value = payoutName
  exchangeDataByProvider.value = exchangeStore.exchangeDataByProvider({
    title: payoutName
  })
}
</script>

<template>
  <div class="ExchangeContainer">
    <div class="content">
      <!-- 兑换统计 -->
      <div class="statistics" v-if="game_balance_data">
        <div class="staContain">
          <p>
            <van-image width="6.5vw" fit="contain" lazy-load :src="imgObj.coinsUrl" />
            <span>{{ $t('exchange.my_balance') }}</span>
          </p>
          <p>{{ game_balance_data.user_coins }}</p>
          <p>
            <span>
              ≈
              {{ game_balance_data.estimated_currency
              }}{{ game_balance_data.estimated_cash }}
            </span>
          </p>
        </div>
        <div class="staContain right">
          <p>
            <van-image width="6vw" fit="contain" lazy-load :src="imgObj.redeemedUrl" />
            <span>{{ $t('exchange.redeemed') }}</span>
          </p>
          <p>
            {{ game_balance_data.estimated_currency }} {{ game_balance_data.total_trade_amount }}
          </p>
          <p>
            <span @click="goToRecord"> {{ $t('exchange.record') }} </span>
          </p>
        </div>
      </div>
      <div class="statistics" v-else><van-loading /></div>
      <!-- 兑换方式 -->
      <div class="exchangeWay" v-if="exchangePayoutList">
        <h3>{{ $t('exchange.way.title') }}</h3>
        <div class="payoutContain">
          <div :class="['van-button', payoutActive == Payout.payoutName ? 'active' : '']"
            v-for="Payout in exchangePayoutList" @click="switchPayout(Payout.payoutName)">
            <van-image width="7vw" fit="fill" lazy-load :src="Payout.payoutIcon" />
            <p>{{ Payout.payoutName }}</p>
          </div>
        </div>
      </div>
      <!-- 兑换卡片 -->
      <ExchangePlatform v-if="exchangeDataByProvider" :obj="{
        title: exchangeDataByProvider[0].exchange_payout_name,
        bgColor: ExchangeCardColor[0],
        imgUrl: exchangeDataByProvider[0].exchange_icon
      }" @clickCard="clickCard" :data="exchangeDataByProvider"></ExchangePlatform>
      <!-- <ExchangePlatform :obj="{
        title: key,
        bgColor: ExchangeCardColor[index],
        imgUrl: item[0].exchange_icon
      }" @clickCard="clickCard" v-for="(item, key, index) in exchange_data" :data="item"></ExchangePlatform> -->
    </div>
    <!-- 兑换弹窗 -->
    <EPopup :popShow="popShow" v-if="popShow" :data="{
      popType: popType
    }" @closePop="() => (popShow = false)" @goToDetail="goToDetail"></EPopup>
    <!-- 邮件暂时不弄 -->
    <!-- <van-popup :close-on-click-overlay="true" v-model:show="emailShow" class="emailPopup popup">
      <h3>Bind Email</h3>
      <div class="pContent">
        <div class="formContain">
          <input type="text" placeholder="Enter your email address" />
          <div>
            <input type="text" placeholder="Enter confirmation code" />
            <div>Send(<span>59</span>)</div>
          </div>
          <p>The verification code email may go into the spam folder!</p>
        </div>
        <div>
          <h5>Tips:</h5>
          <p>
            1. After binding your email address, you can use it to log in to the App and reset your
            password to protect your account security.
          </p>
          <p>
            2. If you encounter problems with binding, you can contact customer service via WhatsApp
            or send an email to <span>contact.official.center@gmail.com</span>
          </p>
        </div>
      </div>
      <div class="btnContain">
        <div class="agreeBtn">Sure</div>
      </div>
    </van-popup> -->
  </div>
</template>
<style scoped>
.ExchangeContainer {
  /* height: 100vh; */
  background-color: #fff8eb;
  background-image: url('@/assets/image/exchange/curtain.png');
  background-repeat: no-repeat;
  background-size: contain;
  overflow: hidden;
  min-height: 100vh;

  .content {
    margin-top: 9vh;
    min-height: 91vh;
    padding: 0 6vw;

    .statistics {
      width: 86vw;
      height: 10.5vh;
      background-image: url('@/assets/image/exchange/blueFrame.png');
      background-size: 88vw 12vh;
      background-repeat: no-repeat;
      /* margin: 0 6vw; */
      display: flex;
      justify-content: space-around;
      padding: 0.9vh 1vw 0.6vh;
      margin-bottom: 3.5vh;

      .staContain {
        width: 38vw;
        height: 8.2vh;
        background: #54a4ff;
        border-radius: 1.8vw;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        padding: 0.5vh 0 1vh 2vw;

        >p:nth-child(1) {
          display: flex;
          align-items: center;

          >span {
            font-size: 3.5vw;
            color: #eaf4ff;
            margin-left: 1vw;
          }
        }

        >p:nth-child(2) {
          font-size: 05vw;
          color: #fefefe;
          text-shadow: 0px 0px 3px rgba(142, 28, 167, 0.5);
        }

        >p:nth-last-child(1) {
          >span {
            display: inline-block;
            background-color: #ff6d26;
            border: 1px solid #000;
            border-radius: 1vw;
            padding: 0 1.5vw;
            font-size: 3.4vw;
            color: #fefefe;
          }
        }
      }

      .right {
        >p:nth-last-child(1) {
          >span {
            background-color: #0064d1;
            position: relative;
            padding-right: 5vw;
          }

          >span::after {
            content: '';
            display: inline-block;
            width: 0;
            height: 0;
            border-top: 3px solid transparent;
            /* 上边框 */
            border-bottom: 3px solid transparent;
            /* 下边框 */
            border-left: 5px solid white;
            /* 左边框为白色 */
            border-radius: 2px;
            position: absolute;
            top: 0.8vh;
            right: 2vw;
          }
        }
      }
    }

    .exchangeWay {
      font-weight: normal;
      font-size: 4vw;
      color: #333333;

      >h3 {
        position: relative;
        font-size: 4.1vw;
        padding-left: 2vw;

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

      .payoutContain {
        display: flex;
        flex-wrap: wrap;

        .van-button {
          width: 28vw;
          height: 4.5vh;
          /* background: linear-gradient(0deg, #48B500 0%, #54D301 100%); */
          background: #ECECEC;
          border-radius: 1.7vw;
          font-size: 4vw;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0.5vh 1vw 0 0;
          color: #9A9A9A;
        }

        .active {
          background: linear-gradient(0deg, #48B500 0%, #54D301 100%);
          color: #FFFFFF;
        }
      }
    }
  }
}
</style>
