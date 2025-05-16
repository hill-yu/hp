<script setup>
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'
import { useRouter } from 'vue-router'
import { importImg } from '@/utils/utils'
import { useI18n } from 'vue-i18n'
const router = useRouter()
const { t } = useI18n()
const imgObj = {
  closeIconUrl: importImg('image/exchange/closeIcon.png')
}
const props = defineProps({
  popShow: {
    type: Boolean
  },
  data: {
    type: Object
  }
})
const emit = defineEmits(['closePop', 'goToDetail'])
const seconds = ref(6) // 倒计时初始值
const isCounting = ref(false) // 是否正在倒计时
let timer = null // 定义计时器变量
onMounted(() => {
  if (props.data.popType == 0) {
    startCountdown()
  }
})
const goClause = () => {
  router.push({
    name: 'clause',
    params: {
      name: 'useragreement'
    },
    hash: '#rules'
  })
}
const contentTwo = computed(() => {
  return t('exchange.popup.prohibition.content_two').replace(
    'RULES OF CONDUCT',
    `<span style="font-size: 4.4vw; font-weight: bolder; color: #50CA01; text-decoration: underline;">RULES OF CONDUCT</span>`
  )
})

const startCountdown = () => {
  if (isCounting.value) return // 如果已经在倒计时，则返回
  isCounting.value = true // 设置为正在倒计时
  seconds.value = 6 // 重置倒计时
  timer = setInterval(() => {
    if (seconds.value > 0) {
      seconds.value-- // 每秒减少1
    } else {
      clearInterval(timer) // 倒计时结束，清除计时器
      isCounting.value = false // 结束倒计时
    }
  }, 1000)
}
onBeforeUnmount(() => {
  clearInterval(timer) // 清理计时器
})
</script>
<template>
  <!-- 0:兑换协议,1:禁止兑换 -->
  <div class="popContainer">
    <van-popup :close-on-click-overlay="false" v-model:show="props.popShow" class="popup">
      <h3 v-if="props.data.popType == 1">
        {{ $t('exchange.popup.prohibition') }}
        <van-image
          class="closeIcon"
          width="3.4vw"
          height="1.6vh"
          lazy-load
          :src="imgObj.closeIconUrl"
          @click="emit('closePop')"
        />
      </h3>
      <h3 v-else>{{ $t('exchange.popup.agreement') }}</h3>
      <div class="pContent">
        <ul v-if="props.data.popType == 1" style="min-height: 36vh">
          <li>
            {{ $t('exchange.popup.prohibition.content_o') }}
          </li>
          <li>
            <span @click="goClause" v-html="contentTwo"></span>
            <br />
            {{ $t('exchange.popup.prohibition.content_thr') }}
          </li>
        </ul>
        <ul v-else>
          <li>
            {{ $t('exchange.popup.agreement.content_o') }}
          </li>
          <li>
            {{ $t('exchange.popup.agreement.content_two') }}
          </li>
          <li>
            {{ $t('exchange.popup.agreement.content_thr') }}
          </li>
          <li>
            {{ $t('exchange.popup.agreement.content_four') }}
          </li>
        </ul>
      </div>
      <div :class="['btnContain', props.data.popType == 1 ? 'condition-class' : '']">
        <div class="singleBtn goBtn" v-if="props.data.popType == 1" @click="emit('closePop')">
          <span>{{ $t('exchange.popup.prohibition.btn_sure') }}</span>
        </div>
        <div v-else class="multBtn">
          <div class="disagreeBtn" @click="emit('closePop')">
            {{ $t('exchange.popup.agreement.btn_disagree') }}
          </div>
          <div :class="['goBtn', isCounting ? 'disable' : '']" @click="emit('goToDetail')">
            <span> {{ $t('exchange.popup.agreement.btn_agree') }}({{ seconds }})</span>
          </div>
        </div>
      </div>
    </van-popup>
  </div>
</template>
<style scoped>
.popContainer {
  .van-popup {
    background: transparent; /* 设置为透明 */
  }
  .van-popup--center {
    top: -55vh;
    margin: -50% auto;
  }
  .popup {
    background-image: url('@/assets/image/exchange/popupBg.png');
    background-size: 100% 100%;
    background-repeat: no-repeat;
    padding: 2vh 6.5vw;
    position: relative;
    > h3 {
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
      > ul li {
        margin-bottom: 1.5vh;
      }
    }
    .btnContain {
      margin-bottom: 2.8vh;
      font-weight: normal;
      font-size: 4.8vw;
      .singleBtn {
        width: 48%;
        text-align: center;
      }
      .multBtn {
        display: flex;
        justify-content: space-between;
        text-align: center;
        > div {
          width: 48%;
          border-radius: 2vw;
        }
        .disagreeBtn {
          color: #333;
          background-color: #fff;
          border: 1px solid #000;
          line-height: 4.5vh;
        }
        .disable {
          pointer-events: none; /* 使元素不可点击 */
        }
      }
    }
    .condition-class {
      display: flex;
      justify-content: center;
    }
    /* .formContain {
      input {
        background: #e9e9e9;
        border-radius: 1.2vw;
        border: 0px;
      }
    } */
  }
}
</style>
