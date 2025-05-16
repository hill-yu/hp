<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { importImg, formatDate } from '@/utils/utils'
import { get_share_store } from '@/api/invite'
import config from '@/config'
const { t, locale } = useI18n() // 获取 t 函数和 locale
// 使用 import 引入图片,不然打包的时候识别不了
const imgObj = {
  aImgUrl: importImg('image/inviteLink/avatar.png'),
  lImgUrl: importImg('image/inviteLink/logo.png')
}
// 获取路由传递过来的数据
const route = useRoute()
const user_code = computed(() => route.query.user_code)
const rewardCash = computed(() => route.query.rewardCash)
// 第几个文案
const txt = computed(() => route.query.txt)
const google_store_url = ref('')
const txtContent = ref(null)
const txtContentList = ref([])
const language = ref('')
onMounted(async () => {
  console.log(rewardCash.value,'rewardCash')
  const browserLanguage = navigator.language || navigator.userLanguage
  const matchedKey = Object.keys(config.langObj).find((key) => browserLanguage.startsWith(key))
  if (matchedKey) {
    language.value = config.langObj[matchedKey]
  } else {
    language.value = 'en' // 默认语言
  }
  // 设置语言
  locale.value = language.value
  // 请求谷歌商店地址
  await get_share_store({ user_code: user_code.value }).then((result) => {
    console.log(result)
    google_store_url.value = result.data
  })
  txtContentList.value = [
    computed(() => {
      return t('invite.popup.content_one')
        .replace(
          'INVITE_CODE',
          `<span style="color: #00fffc;text-decoration: underline;">${user_code.value}</span>`
        )
        .replace('REWARD_CASH', rewardCash.value)
        .replace('REWARD_COIN', config.bindReward)
        .replace('INVITE_LINK', '')
    }),
    computed(() => {
      return t('invite.popup.content_two')
        .replace(
          'INVITE_CODE',
          `<span style="color: #00fffc;text-decoration: underline;">${user_code.value}</span>`
        )
        .replace('REWARD_CASH', rewardCash.value)
        .replace('REWARD_COIN', config.bindReward)
        .replace('INVITE_LINK', '')
    }),
    computed(() => {
      return t('invite.popup.content_three')
        .replace(
          'INVITE_CODE',
          `<span style="color: #00fffc;text-decoration: underline;">${user_code.value}</span>`
        )
        .replace('REWARD_CASH', rewardCash.value)
        .replace('REWARD_COIN', config.bindReward)
        .replace('INVITE_LINK', '')
    })
  ]
  txtContent.value = txtContentList.value[txt.value].value
})
// 点击下载事件
const downloadApp = () => {
  window.open(google_store_url.value, '_blank')
}
</script>

<template>
  <div class="indexContainer">
    <div class="inviteGuidance">
      <van-image width="13.vw" height="6vh" fit="contain" lazy-load :src="imgObj.aImgUrl" />
      <div class="iGContent">
        <div class="CContainer">
          <p v-html="txtContent"></p>
        </div>
        <div class="time">{{ formatDate() }}</div>
      </div>
    </div>
    <div class="Welfare">
      <div class="container">
        <div class="prizes">
          <span>+{{ config.bindReward }}</span>
        </div>
        <div class="currency">
          <span>{{ $t('invite.coin') }}</span>
        </div>
        <p>{{ $t('invitelink.title') }}</p>
      </div>
      <van-button @click="downloadApp">{{ $t('invitelink.btn_one') }} </van-button>
      <div class="statement">
        <p>
          {{ config.appName }}
          <RouterLink :to="{ name: 'clause', params: { name: 'useragreement' } }">
            Terms of Use
          </RouterLink>
          &
          <RouterLink :to="{ name: 'clause', params: { name: 'privacypolicy' } }">
            Privacy Notice
          </RouterLink>
        </p>
        <p>{{ $t('invitelink.notice') }}</p>
      </div>
    </div>
    <div class="footer">
      <div class="footer_contain">
        <van-image width="14.6vw" height="7vh" fit="contain" lazy-load :src="imgObj.lImgUrl" />
        <div class="info">
          <p>{{ config.appName }}</p>
          <p>{{ $t('invitelink.title_two') }}</p>
        </div>
        <van-button @click="downloadApp">{{ $t('invitelink.btn_two') }}</van-button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.indexContainer {
  height: 100vh;
  background: url('@/assets/image/inviteLink/bg-top.png') no-repeat top;
  background-size: 100% 59vh;
  background-color: #fff;

  .inviteGuidance {
    display: flex;
    /* align-items: ; */
    padding: 4.2vh 0 0 3vw;

    .iGContent {
      position: relative;

      &::before {
        content: '';
        width: 0;
        height: 0vh;
        /* background-color: #d26aeb; */
        border-bottom: 0.5vh solid transparent;
        border-top: 0.5vh solid transparent;
        border-right: 1.5vw solid #d26aeb;
        position: absolute;
        top: 2vh;
        left: -1vw;
      }

      .CContainer {
        width: 67vw;
        background: linear-gradient(90deg, #d26aeb 0%, #a021fb 100%);
        border-radius: 3vw;
        padding: 2vh 4.9vw 2.5vh 8vw;
        color: #ffffff;
        font-size: 3.6vw;

        >p {
          height: 15vh;
          overflow-y: scroll;
        }
      }

      .time {
        text-align: right;
        color: #999999;
        font-size: 3.4vw;
        margin-top: 1vh;
      }
    }
  }

  .Welfare {
    .container {
      height: 37.4vh;
      background: url('@/assets/image/inviteLink/packet.png') no-repeat right;
      background-size: 96vw 100%;
      margin-bottom: 2.2vh;
      text-align: center;
      overflow: hidden;

      .prizes {
        text-align: center;
        margin-top: 4.5vh;

        span {
          font-size: 13.5vw;
          color: #a017b6;
          text-shadow:
            0.6vw 0 0 #6312be,
            -0.6vw 0 0 #6312be,
            0 0.6vw 0 #6312be,
            0 -0.6vw 0 #6312be,
            0.42vw 0.42vw 0 #6312be,
            -0.42vw 0.42vw 0 #6312be,
            0.42vw -0.42vw 0 #6312be,
            -0.42vw -0.42vw 0 #6312be;
        }
      }

      .currency {
        text-align: center;
        margin-bottom: 9.8vh;

        span {
          font-size: 3.7vw;
          color: #d63bef;
          text-shadow: 0px 0.17vw 0.08vw rgba(13, 73, 141, 0.56);
          position: relative;
        }

        span::before {
          content: '';
          display: inline-block;
          width: 9.4vw;
          height: 0.36vh;
          position: absolute;
          top: 50%;
          left: 15vw;
          background: linear-gradient(90deg, #c608df 0%, rgba(255, 225, 171, 0) 100%);
          border-radius: 5px;
          opacity: 0.64;
        }

        span::after {
          content: '';
          display: inline-block;
          width: 9.4vw;
          height: 0.36vh;
          position: absolute;
          top: 50%;
          right: 15vw;
          background: linear-gradient(90deg, rgba(255, 225, 171, 0) 0%, #c608df 100%);
          border-radius: 5px;
          opacity: 0.64;
        }
      }

      >p {
        display: inline-block;
        background: rgba(160, 23, 182, 0.86);
        height: 5.4vh;
        border-radius: 2.7vh;
        text-align: center;
        line-height: 5.4vh;
        color: #f4def9;
        font-size: 4.1vw;
        padding: 0 5.5vw;
      }
    }

    .van-button {
      width: 87vw;
      margin: 0 6.5vw;
      background: linear-gradient(0deg, #46b000 0%, #56d801 100%);
      color: #ffffff;
      font-size: 4.3vw;
      margin-bottom: 2.3vh;
      border-radius: 2vw;
    }

    .statement {
      width: 80vw;
      padding: 0 10vw;
      text-align: center;

      >p {
        font-size: 3.4vw;
        color: #333333;
        line-height: 2.5vh;

        >a {
          color: #20710e;
          text-decoration: underline;
        }
      }

      >p:nth-last-child(1) {
        margin-top: 1.6vh;
        color: #666666;
      }
    }
  }

  .footer {
    width: 92.8vw;
    height: 11.8vh;
    position: fixed;
    left: 0;
    bottom: 0;
    display: flex;
    align-items: end;
    padding: 0 3.4vw 1.2vh;
    background: url('@/assets/image/inviteLink/bg-bottom.png') no-repeat center;
    background-size: 100% 13vh;

    .footer_contain {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;

      .info {
        display: flex;
        flex-direction: column;
        min-width: 50vw;

        >p:nth-child(1) {
          color: #333333;
          font-size: 4.4vw;
          font-weight: bold;
          margin-bottom: 0.5vh;
        }

        >p:nth-child(2) {
          color: #666666;
          font-size: 3.6vw;
        }
      }

      .van-button {
        background: linear-gradient(0deg, #46b000 0%, #56d801 100%);
        border-radius: 0.9vw;
        width: 22.7vw;
        height: 4vh;
        color: #ffffff;
        font-size: 3.6vw;
      }
    }
  }
}
</style>
