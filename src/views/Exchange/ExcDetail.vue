<script setup>
import { ref, reactive, watch, computed, onMounted } from 'vue'
import { showToast, showFailToast } from 'vant'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { importImg, formatNumber, formatDate, docuLocation } from '@/utils/utils'
import { useExchangeStore } from '@/stores/exchange'
import { post_game_payout, get_game_payout_sync } from '@/api/exchange'
const router = useRouter()
const { t } = useI18n() // 获取 t 函数和 locale
// 图片进行import导入
const imgObj = {
  lightMoneyUrl: importImg('image/exchange/lightMoney.png'),
  coinIconUrl: importImg('image/exchange/coinIcon.png'),
  wenIconUrl: importImg('image/exchange/wenIcon.png'),
  closeIconUrl: importImg('image/exchange/closeIcon.png'),
  checkUrl: importImg('image/exchange/check.png')
}
// 获取路由传递过来的数据
const route = useRoute()
const query_data = computed(() => JSON.parse(route.query.data))
// 通过store获取数据
const exchangeStore = useExchangeStore()
const exchangeData = exchangeStore.exchangeData({
  id: query_data.value.id,
  title: query_data.value.title
})[0]
console.log('exchangeData', exchangeData);
const popupContent = ref(t('exchange.detail.popup.content'))
// 获取payoutData请求数据
const payoutData = ref(null)
const formData = reactive({})
onMounted(async () => {
  if (exchangeData) {
    await exchangeStore
      .getPayout({
        exchange_provider_code: exchangeData.exchange_provider_code,
        exchange_payout_target: exchangeData.exchange_payout_target
      })
      .then(() => {
        payoutData.value = exchangeStore.payoutData
        createFillFrom(payoutData.value.filling_fields)
      })
  }
})
const createFillFrom = (filling_data) => {
  for (let key in filling_data) {
    let type_data = filling_data[key]
    if (key == 'input') {
      for (let item in type_data) {
        formData[Object.keys(type_data[item])] = ''
      }
    } else if (key == 'confirm_input') {
      for (let item in type_data) {
        formData[Object.keys(type_data[item])] = ''
        formData['confirm_' + Object.keys(type_data[item])] = ''
      }
    } else {
      for (let item in type_data) {
        formData[Object.keys(type_data[item])] = ''
      }
    }
  }
}
// 监听表单数据
// const errorShow = ref(false)
// watch(
//   () => formData,
//   (newValue, oldValue) => {
//     for (const key in newValue) {
//       if (key.startsWith('confirm_')) {
//         const originalKey = key.slice(8) // 去掉 'confirm_'
//         if (String(newValue[key]) !== String(newValue[originalKey])) {
//           errorShow.value = true
//           return // 找到不一致则退出
//         } else {
//           errorShow.value = false
//         }
//       }
//     }
//   },
//   { deep: true }
// )
const popShow = ref(false)
// 提交表单
const submitFrom = async () => {
  console.log(exchangeData)
  // 判断是否有兑换配置
  if (exchangeData) {
    const required_data = {
      game_exchange_id: exchangeData.id,
      exchange_amount: exchangeData.exchange_amount,
      exchange_currency: exchangeData.exchange_currency,
      exchange_actual_amount: exchangeData.exchange_actual_amount,
      exchange_provider_code: exchangeData.exchange_provider_code,
      exchange_payout_target: exchangeData.exchange_payout_target
    }
    // 验证表单数据
    if (validateForm()) {
      const request_data = { ...required_data, ...formData }
      console.log('request_data', request_data)
      await post_game_payout(request_data).then(async (result) => {
        if (result.code === 200) {
          const update_asset_params = `update_asset=1`
          docuLocation(update_asset_params)
          createFillFrom(payoutData.value.filling_fields)
          if (exchangeData.exchange_type == 1) {
            popShow.value = true
            popupContent.value = t('exchange.detail.popup.content_two')
            await get_game_payout_sync({
              'payout_order_id': result.data['order_id']
            }).then((res) => {
              if (res.code === 200) {

              }
            }).catch((error) => {
              console.log('get_game_payout_sync', error);
              showFailToast({
                message: 'require fail'
              })
            })
          } else {
            popShow.value = true
          }
        } else if (result.code === 5002 && result.data?.is_payout_order) {
          showFailToast({
            message: t('exchange.is_exchange_tip')
          })
        } else {
          showFailToast({
            message: 'require fail'
          })
        }
      })
    }
    return
  } else {
    showFailToast({
      // message: '未获取到兑换配置数据'
      message: 'no data'
    })
  }
}
// 验证表单
const validateForm = () => {
  for (const key in formData) {
    formData[key] = String(formData[key])
    if (key.startsWith('confirm_')) {
      const originalKey = key.slice(8) // 去掉 'confirm_'
      if (formData[key] !== formData[originalKey]) {
        showFailToast({
          message: `Inconsistent ${key.replace(/_/g, ' ')}`
        })
        return 0
      } else {
        delete formData[key]
        console.log('难道还能一致')
      }
    } else if (formData[key] === '') {
      showFailToast({
        message: `${key.replace(/_/g, ' ')} can't be empty`
      })
      return 0
    }
  }
  return 1
}
const goToRecord = () => {
  router.push({ name: 'exchangeRecord' })
}
const showToastTip = (key) => {
  showToast({
    message: t(`${key}_tip`),
    duration: 3000
  })
}
</script>

<template>
  <div class="ExcDetailContainer">
    <div class="content">
      <strong></strong>
      <!-- 兑换内容区域 -->
      <div class="exContain" v-if="exchangeData">
        <div class="header borBottom">
          <van-image width="14.5vw" height="6.7vh" fit="fill" lazy-load :src="imgObj.lightMoneyUrl" :style="{
            'background-color': query_data.bgColor
          }" />
          <div>
            <div class="cellStyle" :style="{ padding: 0 }">
              <span>{{ $t('exchange.detail.ex_amount') }}:</span>
              <span>
                {{ exchangeData.exchange_currency }} {{ exchangeData.exchange_amount }}
              </span>
            </div>
            <div>
              <p>
                <van-image width="3.5vw" height="1.6vh" lazy-load :src="imgObj.coinIconUrl" />
                <span>-{{ exchangeData.asset_amount }}</span>
              </p>
              <span>{{ formatDate() }}</span>
            </div>
          </div>
        </div>
        <div class="cellStyle borBottom" v-if="exchangeData.exchange_fee">
          <span @click="showToastTip('exchange.detail.handling_fees')">
            {{ $t('exchange.detail.handling_fees') }}
            <van-image width="3vw" height="1.4vh" lazy-load :src="imgObj.wenIconUrl" />
          </span>
          <span :style="{ 'font-size': '4vw', color: '#FF6D26', 'font-weight': 'bolder' }">
            -{{ exchangeData.exchange_currency }} {{ exchangeData.exchange_fee }}
          </span>
        </div>
        <div class="cellStyle borBottom" v-if="exchangeData.exchange_taxes">
          <span @click="showToastTip('exchange.detail.taxes')">
            {{ $t('exchange.detail.taxes') }}
            <van-image width="3vw" height="1.4vh" lazy-load :src="imgObj.wenIconUrl" />
          </span>
          <span :style="{ 'font-size': '4vw', color: '#FF6D26', 'font-weight': 'bolder' }">
            -{{ exchangeData.exchange_currency }} {{ exchangeData.exchange_taxes }}
          </span>
        </div>
        <div class="cellStyle borBottom" v-if="exchangeData.exchange_discount_amount">
          <span @click="showToastTip('exchange.detail.discount_amount')">
            {{ $t('exchange.detail.discount_amount') }}
            <van-image width="3vw" height="1.4vh" lazy-load :src="imgObj.wenIconUrl" />
          </span>
          <span :style="{ 'font-size': '4vw', color: '#50CA01', 'font-weight': 'bolder' }">
            +{{ exchangeData.exchange_currency }}
            {{ exchangeData.exchange_discount_amount }}
          </span>
        </div>
        <div class="cellStyle">
          <span :style="{ 'font-size': '4vw', color: '#333333', 'font-weight': 'bolder' }">
            {{ $t('exchange.detail.actual_amount_received') }}
          </span>
          <span :style="{ 'font-size': '5.6vw', color: '#50CA01', 'font-weight': 'bolder' }">
            {{ exchangeData.exchange_currency }}
            {{ exchangeData.exchange_actual_amount }}
          </span>
        </div>
      </div>
      <!-- 收款信息 -->
      <div class="payContain">
        <h3>{{ $t('exchange.detail.payment_info') }}</h3>
        <div class="payForm" v-if="payoutData">
          <div v-if="payoutData.filling_fields.input">
            <input :type="Object.keys(inputItem)[0] == 'phone' ? 'number' : 'text'"
              v-model="formData[Object.keys(inputItem)[0]]" v-for="inputItem in payoutData.filling_fields.input"
              :placeholder="$t(`exchange.detail.${Object.keys(inputItem)[0]}`)" />
          </div>
          <div class="bankNameSel" v-if="payoutData.filling_fields.select">
            <select name="" id="" :class="[formData[Object.keys(selItem)[0]] == '' ? 'placeholder' : '']"
              v-model="formData[Object.keys(selItem)[0]]" v-for="selItem in payoutData.filling_fields.select">
              <option value="" class="placeholder" selected disabled>
                {{ $t('exchange.detail.sel_bank') }}
              </option>
              <option :value="Object.keys(optItem)[0]" class="otherOption"
                v-for="optItem in selItem[Object.keys(selItem)[0]]">
                {{ Object.keys(optItem)[0] }}
              </option>
            </select>
          </div>
          <div v-if="payoutData.filling_fields.confirm_input">
            <div v-for="confirmInputItem in payoutData.filling_fields.confirm_input">
              <input type="text" v-model="formData[Object.keys(confirmInputItem)[0]]"
                :placeholder="$t(`exchange.detail.${Object.keys(confirmInputItem)[0]}`)" />
              <input type="text" v-model="formData['confirm_' + Object.keys(confirmInputItem)[0]]"
                :placeholder="$t(`exchange.detail.again_${Object.keys(confirmInputItem)[0]}`)" />
              <!-- <span class="error" v-show="errorShow">
                Fail {{ confirmInputItem[Object.keys(confirmInputItem)[0]] }}
              </span> -->
            </div>
          </div>
        </div>
        <LoadPage v-else></LoadPage>
      </div>
      <!-- 兑换提示 -->
      <div class="tipContain">
        <h3>{{ $t('exchange.detail.ex_tips') }}</h3>
        <ul>
          <li>{{ $t('exchange.detail.tip.content_o') }}</li>
          <li>{{ $t('exchange.detail.tip.content_two') }}</li>
          <li>{{ $t('exchange.detail.tip.content_thr') }}</li>
        </ul>
      </div>
    </div>
    <!-- 申请兑换按钮 -->
    <div class="applyBtn">
      <div @click="submitFrom" class="goBtn">
        <span>{{ $t('exchange.detail.btn_apply') }}</span>
      </div>
    </div>
    <!-- 兑换成功弹窗 -->
    <van-popup :close-on-click-overlay="false" v-model:show="popShow" class="popup">
      <h3>
        {{ $t('exchange.detail.popup.title') }}
        <van-image class="closeIcon" width="3.4vw" height="1.6vh" lazy-load :src="imgObj.closeIconUrl"
          @click="() => (popShow = false)" />
      </h3>
      <div class="pContent">
        <ul>
          <li>
            <van-image width="18.8vw" height="7.2vh" lazy-load :src="imgObj.checkUrl" />
          </li>
          <li>{{ $t('exchange.detail.popup.success') }}</li>
          <li v-html="popupContent"></li>
        </ul>
      </div>
      <div class="btnContain">
        <div class="singleBtn goBtn" @click="goToRecord">
          <span>{{ $t('exchange.detail.popup.btn_view') }}</span>
        </div>
      </div>
    </van-popup>
  </div>
</template>
<style scoped>
.ExcDetailContainer {
  min-height: 100vh;
  background-color: #fff8eb;
  background-image: url('@/assets/image/exchange/curtain.png');
  background-repeat: no-repeat;
  background-size: contain;
  overflow: hidden;
  padding-bottom: 10vh;

  .content {
    margin-top: 9vh;
    padding: 0 5.7vw;

    .exContain {
      background: #ffffff;
      border-radius: 3.3vw;
      border: 1px solid #000000;
      padding: 2vh 3.2vw 1vh;

      .cellStyle {
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 3.4vw;
        color: #333333;
        padding: 1.8vh 0;
      }

      .borBottom {
        border-bottom: 1px solid #ededed;
      }

      .header {
        display: flex;
        align-items: center;
        padding-bottom: 1.8vh;

        >.van-image {
          border-radius: 1.7vw;
          border: 1px solid #000;
        }

        >div:nth-last-child(1) {
          margin-left: 3vw;
          flex-grow: 1;

          >div:nth-child(1) {
            >span:nth-child(1) {
              font-size: 3.5vw;
              color: #666666;
            }

            >span:nth-child(2) {
              font-size: 5.6vw;
              font-weight: bolder;
              color: #000;
            }
          }

          >div:nth-child(2) {
            display: flex;

            >p {
              background: linear-gradient(0deg, #48b701 0%, #6fd91a 100%);
              border-radius: 1.8vw;
              font-weight: bold;
              font-size: 3.4vw;
              color: #ffffff;
              display: flex;
              align-items: center;
              justify-content: center;
              padding: 0 1.7vw;
              margin-right: 2vw;

              >span {
                margin-left: 0.5vw;
              }
            }

            >span {
              font-size: 3.4vw;
              color: #666666;
            }
          }
        }
      }
    }

    .payContain {
      margin-top: 1.4vh;
      background: #ffffff;
      border-radius: 3.3vw;
      border: 1px solid #000000;
      padding: 2vh 3.2vw;

      >h3 {
        margin-bottom: 2vh;
        position: relative;
        padding-left: 2.5vw;

        &::before {
          content: '';
          display: inline-block;
          width: 1vw;
          height: 1.5vh;
          background-color: #50ca01;
          border: 1px solid #000;
          position: absolute;
          top: 0.8vh;
          left: 0;
        }
      }

      .payForm {
        border-radius: 1.2vw;

        >div {

          input,
          select {
            display: block;
            width: 100%;
            box-sizing: border-box;
            /* 确保内边距和边框包含在宽度中 */
            background: transparent;
            background: #e9e9e9;
            border: 0;
            padding: 1.6vh 0 1.6vh 3.2vw;
            font-size: 3.5vw;
            margin-top: 1.4vh;
            border-radius: 1.5vw;
          }

          select {
            appearance: none;
            /* 去除默认样式 */
            background: #e9e9e9;
            background-image: url('@/assets/image/exchange/downIcon.png');
            /* 自定义箭头图像 */
            background-repeat: no-repeat;
            background-position: 95% 50%;
            background-size: 2.8vw;
            /* 控制图像大小 */
          }

          /* 可选：自定义其他样式 */
          select:focus {
            outline: none;
            /* 去掉聚焦时的边框 */
          }

          .placeholder {
            color: #666;
          }

          .otherOption {
            color: #000;
          }
        }

        .error {
          font-size: 3vw;
          color: red;
        }
      }
    }

    .tipContain {
      margin-top: 2.2vh;

      >h3 {
        font-size: 4vw;
        font-weight: bolder;
        margin-bottom: 1vh;
      }
    }
  }

  .applyBtn {
    width: 88vw;
    position: fixed;
    bottom: 0;
    left: 0;
    background: #ffffff;
    box-shadow: 0px -1px 0.7vh 0.2vw rgba(155, 101, 0, 0.24);
    padding: 1.5vh 6vw;

    >div {
      font-size: 4.8vw;
    }
  }

  .van-popup {
    background: transparent;
    /* 设置为透明 */
  }

  .popup {
    background-image: url('@/assets/image/exchange/popupBg.png');
    background-size: 100% 100%;
    background-repeat: no-repeat;
    padding: 2vh 6.5vw;

    >h3 {
      text-align: center;
      margin-bottom: 5.7vh;
      font-weight: normal;
      font-size: 4.6vw;
      color: #ffffff;
      text-shadow: 0px 1px 1vw rgba(0, 0, 0, 0.7);

      .closeIcon {
        position: absolute;
        top: 1.5vh;
        right: 3.6vw;
      }
    }

    .pContent {
      max-height: 39vh;
      overflow-y: scroll;
      margin-bottom: 4.7vh;
      font-size: 4.2vw;
      color: #333333;

      >ul li {
        margin-bottom: 1.5vh;
        text-align: center;
      }

      >ul li:nth-child(2) {
        font-weight: bolder;
        font-size: 4.8vw;
      }

      >ul li:nth-child(3) {
        font-size: 3.7vw;
        color: #666666;
      }
    }

    .btnContain {
      margin-bottom: 2.8vh;
      font-size: 4.8vw;

      .singleBtn {
        text-align: center;
      }
    }
  }
}
</style>
