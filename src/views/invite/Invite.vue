<script setup>
import { ref, onMounted, computed, provide } from 'vue'
import { useI18n } from 'vue-i18n'
import { showToast, showFailToast } from 'vant'
import { useRoute, useRouter } from 'vue-router'
import { useInviteStore } from '@/stores/invite'
import { useLangStore } from '@/stores/lang'
import IHeader from '@/components/invite/IHeader.vue'
import IconBtn from '@/components/public/IconBtn.vue'
import Statistics from '@/components/invite/Statistics.vue'
import InviteF from '@/components/invite/InviteF.vue'
import RewardD from '@/components/invite/RewardD.vue'
import InviteP from '@/components/invite/InviteP.vue'
import Ipopup from '@/components/invite/Ipopup.vue'
import IActivity from '@/components/invite/IActivity.vue'
import IpopupRule from '@/components/invite/IpopupRule.vue'
import RankingPrize from '@/components/inviteRanking/RankingPrize.vue';
import { importImg, docuLocation, selectRandomNumber, getCurrentDate, formatUrl, formattedValue } from '@/utils/utils'
import config from '@/config'
import { post_invite_welfare_reward, get_invite_welfare, get_rank_award_total } from '@/api/invite'

const { t, locale } = useI18n() // 获取 t 函数和 locale
// 使用 import 引入图片,不然打包的时候识别不了
const imgObj = {
  wAImgUrl: importImg('image/invite/WhatsApp-icon.png'),
  twiImgUrl: importImg('image/invite/Twitter-icon.png'),
  telImgUrl: importImg('image/invite/Telegram-icon.png'),
  lSImgUrl: importImg('image/invite/Link-Share-icon.png'),
  cBImgUrl: importImg('image/invite/closebtn-ic.png'),
  bgCUrl: importImg('image/invite/bg_coin.png'),
  bgSUrl: importImg('image/invite/bg_strength.png'),
  bgBUrl: importImg('image/invite/bg_bleak.png'),
}
// 获取来源类型
const route = useRoute()
const router = useRouter()
// 定义邀请store
const inviteStore = useInviteStore()

const source_type = ref(route.query?.source_type || null)
const showSharePopup = ref(inviteStore.showSharePopup)
// 控制分享弹窗参数
const show = ref(showSharePopup.value || false)
if (showSharePopup.value) {
  inviteStore.changeShowSharePopup()
}

// 显示rule弹窗
const showRulePopup = ref(false)
// 显示活动弹窗
const activityPopShow = ref(false)
const rank_award_total = ref(null)
// 提供数据
const activityTime = ref(null)
provide('activityTime', activityTime);
// 显示邀请福利弹窗
const showWelfarePopup = ref(false)
// 0:新人奖励未领取,1:邀请福利未领取,2:新人奖励领取,3:邀请福利已领取
const PopupType = ref(1)
// 传入弹窗的数据
const PopupData = ref(null)

// 获取邀请福利配置
const inviteWelfare = ref(null)
// 获取邀请配置
const inviteDatas = ref(null)

// 解构语言store
const { language, version } = useLangStore()
// 定义弹窗内容参数
const popupContent = ref(null)
// 定义弹窗内容列表
const popupContentList = ref([])
onMounted(async () => {
  // 加载语言
  locale.value = language
  try {
    // 如果有版本参数，需要请求，并判断是否有领取福利，如果有，需要弹出领取福利弹窗
    if (version && source_type.value == 0) {
      await get_invite_welfare().then((result) => {
        if (result?.code == 200) {
          inviteWelfare.value = result.data
          if (result?.data.remaining_num > 0 && result?.data.countdown == 0) {
            showWelfarePopup.value = true
          }
          PopupData.value = { 'popType': PopupType.value, 'coin': inviteWelfare.value.invite_welfare_coins, 'ad_conin': inviteWelfare.value.invite_ad_coins }
        }
      }).catch((error) => {
        console.log(error);
        showFailToast({
          message: 'service error'
        })
      })
      console.log('inviteWelfare', inviteWelfare);
    } else if (version && source_type.value == 1) {
      let currentDate = getCurrentDate()
      if (currentDate !== localStorage.getItem('lastDisplayDate')) {
        await get_rank_award_total().then((result) => {
          if (result?.code == 200) {
            rank_award_total.value = result.data
            localStorage.setItem('lastDisplayDate', currentDate); // 存储到 localStorage
            activityPopShow.value = true
          }
        }).catch((error) => {
          console.log(error);
          showFailToast({
            message: 'service error'
          })
        })
      }
    }
    // 请求邀请页信息
    await inviteStore.getInvite()
    inviteDatas.value = inviteStore.inviteDatas
    // 多语言，动态配置弹窗内容
    popupContentList.value = [
      computed(() => {
        return t('invite.popup.content_one')
          .replace('INVITE_CODE', inviteDatas.value.invite_code)
          .replace('REWARD_CASH', inviteDatas.value.reward_cash)
          .replace('REWARD_COIN', inviteDatas.value.bind_coins)
          .replace('INVITE_LINK', inviteDatas.value.invite_link + '&txt=0')
      }),
      computed(() => {
        return t('invite.popup.content_two')
          .replace('INVITE_CODE', inviteDatas.value.invite_code)
          .replace('REWARD_CASH', inviteDatas.value.reward_cash)
          .replace('REWARD_COIN', inviteDatas.value.bind_coins)
          .replace('INVITE_LINK', inviteDatas.value.invite_link + '&txt=1')
      }),
      computed(() => {
        return t('invite.popup.content_three')
          .replace('INVITE_CODE', inviteDatas.value.invite_code)
          .replace('REWARD_CASH', inviteDatas.value.reward_cash)
          .replace('REWARD_COIN', inviteDatas.value.bind_coins)
          .replace('INVITE_LINK', inviteDatas.value.invite_link + '&txt=2')
      })
    ]
    // 默认为第一条内容
    popupContent.value = popupContentList.value[0].value
    docuLocation('show')
  } catch (error) {
    console.log(error)
  }
})

// 定义开启分享弹窗事件
function showPopup() {
  show.value = true
  document.body.classList.add('van-overflow-hidden') // 添加样式
}
// 定义关闭分享弹窗事件
function onClose() {
  show.value = false
  document.body.classList.remove('van-overflow-hidden') // 移除样式
}
// 定义关闭活动弹窗事件
function onActivityPopClose() {
  activityPopShow.value = false
}
// 复制内容
const contentToCopy = ref(null)
const copyContent = () => {
  const content_params = `content=${encodeURIComponent(contentToCopy.value.innerText)}`
  showToast({
    message: t('invite.copy_success')
  })
  docuLocation(content_params)
}
// 定义第几个内容
const index_con = ref(0)
// 切换内容
const replaceContent = () => {
  let index = selectRandomNumber(index_con.value, popupContentList.value.length)
  index_con.value = index
  popupContent.value = popupContentList.value[index].value
}
// 定义分享数据列表
const share_data = [
  {
    src: imgObj.wAImgUrl,
    type: 1
  },
  {
    src: imgObj.twiImgUrl,
    type: 2
  },
  {
    src: imgObj.telImgUrl,
    type: 3
  },
  {
    src: imgObj.lSImgUrl,
    type: 4
  }
]
// 点击分享事件
const share = (type) => {
  // inviteDatas.value.reward_cash 参数传到inviteLink.vue
  let reward_cash = inviteDatas.value.reward_cash
  const share_params = `share=${type}&content=${encodeURIComponent(contentToCopy.value.innerText)}&rewardCash=${reward_cash}`
  docuLocation(share_params)
}
// 看广告后额外领取金币和邀请福利奖励
const viewADReceive = () => {
  docuLocation('view_ad')
}
// 定义APP应用使用事件
const takeOverApp = (status) => {
  // status;reward_ad_fail:广告播放失败；reward_ad_success：广告播放成功
  if (status == 'reward_ad_fail') {
    showFailToast({
      message: t('invite.popup_wel.toast.ad_fail')
    })
    inviteStore.setButtonDisabledStatus()
  } else if (status == 'reward_ad_success') {
    console.log('看完广告开始领取金币');
    receiveWalfareReward(1)
  } else {
    showFailToast({
      message: t('invite.popup_wel.toast.ad_fail')
    })
    inviteStore.setButtonDisabledStatus()
  }
}
// 暴露给APP应用使用
window.takeOverApp = takeOverApp
// 领取邀请福利奖励事件
const receiveWalfareReward = async (is_view_ad) => {
  // 传参，是否观看广告
  const request_data = {
    is_view_ad: is_view_ad
  }
  console.log('request_data', request_data);
  await post_invite_welfare_reward(request_data).then((result) => {
    console.log('result', result);
    if (result?.code == 200) {
      // 要通知APP更新资产
      docuLocation(`update_asset=1`)
      PopupType.value = 3
      PopupData.value = { 'popType': PopupType.value, 'coin': result.data['add_coin'] }
      inviteStore.setButtonDisabledStatus()
    } else {
      showFailToast({
        message: 'receive fail'
      })
      inviteStore.setButtonDisabledStatus()
    }
  }).catch((error) => {
    console.log('post_invite_welfare_reward', error);
    showFailToast({
      message: 'service error'
    })
    inviteStore.setButtonDisabledStatus()
  })
}
// 关闭邀请福利弹窗，并弹出分享弹窗
const closePopup = () => {
  showWelfarePopup.value = false
  show.value = true
}
// 直接关闭邀请福利弹窗
const closeDirectPopup = () => {
  showWelfarePopup.value = false
}
const closeRulePopup = () => {
  showRulePopup.value = false
}
const openRulePopup = () => {
  showRulePopup.value = true
}
const goInviteRankings = () => {
  router.push('/invite-rankings')
}

</script>

<template>
  <div class="inviteContainer">
    <div v-if="inviteDatas">
      <!-- 头部 -->
      <IHeader :data="{
        coins: inviteDatas.invite_coins,
        code: inviteDatas.invite_code
      }"></IHeader>
      <!-- 主体内容 -->
      <div class="content">
        <Statistics :is-skip="true" :data="{
          mentee_count: inviteDatas.mentee_count,
          mentee_reward: inviteDatas.mentee_reward
        }"></Statistics>
        <IActivity :is-active="inviteDatas.exist_invite_rank" @openPopup="openRulePopup"></IActivity>
        <InviteF></InviteF>
        <RewardD :invite_coins_stage="inviteDatas.invite_coins_stage"></RewardD>
        <InviteP></InviteP>
      </div>
      <!-- 固定定位按钮，点击打开分享弹窗 -->
      <van-button class="IFBtn" @click="showPopup">
        {{ $t('invite.invite_friend_btn') }}
        <div class="bSign">+{{ inviteDatas.invite_coins }} {{ $t('invite.coin') }}</div>
      </van-button>
      <!-- 分享弹窗 -->
      <van-popup :close-on-click-overlay="true" v-model:show="show" class="iPopup">
        <p class="title">{{ $t('invite.popup.title') }}</p>
        <p class="iContent" ref="contentToCopy">
          {{ popupContent }}
        </p>
        <div class="funBtnC">
          <div class="funBtn" @click="replaceContent">
            {{ $t('invite.popup.btn_replacements') }}
          </div>
          <div class="funBtn" @click="copyContent">{{ $t('invite.popup.btn_copy') }}</div>
        </div>
        <div class="iShareApp">
          <p>{{ $t('invite.popup.share') }}</p>
          <ul class="icon-container">
            <li v-for="item in share_data">
              <van-image fit="fill" lazy-load @click="share(item.type)" :src="item.src" />
            </li>
          </ul>
        </div>
      </van-popup>
      <!-- 领取福利奖励弹窗 -->
      <Ipopup v-if="source_type == 0" :popShow=showWelfarePopup :data="PopupData" @receiveReward="receiveWalfareReward"
        @viewADReceive="viewADReceive" @closePopup="closePopup" @closeDirectPopup="closeDirectPopup"></Ipopup>
      <IpopupRule :popShow=showRulePopup @closePopup="closeRulePopup"></IpopupRule>
      <!-- 活动弹窗 -->
      <van-popup v-model:show="activityPopShow" class="activityPopup">
        <p class="title">{{ $t('invite.activity.popup.title') }}</p>
        <div class="aContent">
          <p>{{ $t('invite.activity.popup.content') }}</p>
          <div class="award-container">
            <div class="img-list">
              <div v-for="itemImg in rank_award_total.entity_awards">
                <van-image width="24vw" height="8.8vh" fit="fill" lazy-load :src="formatUrl(itemImg.images)" />
                <span>{{ itemImg.name }}</span>
              </div>
            </div>
            <div class="img-list">
              <RankingPrize
                :data="{ width: '24', height: '8.8', margin_top: 1.5, kuang_bg_img: imgObj.bgCUrl, reward_value: `+${formattedValue(rank_award_total.coin_total)}`, reward_img_width: '9', text_margin_bottom: -6.5, text_font_size: 3.5 }">
              </RankingPrize>
              <RankingPrize v-if="rank_award_total.strength_total && rank_award_total.strength_total !== 0"
                :data="{ width: '24', height: '8.8', margin_top: 1.5, kuang_bg_img: imgObj.bgSUrl, reward_value: `+${rank_award_total.strength_total}`, reward_img_width: '9', text_margin_bottom: -6.5, text_font_size: 3.5 }">
              </RankingPrize>
              <RankingPrize v-if="rank_award_total.lottery_ticket_total && rank_award_total.lottery_ticket_total !== 0"
                :data="{ width: '24', height: '8.8', margin_top: 1.5, kuang_bg_img: imgObj.bgBUrl, reward_value: `+${rank_award_total.lottery_ticket_total}`, reward_img_width: '9', text_margin_bottom: -6.5, text_font_size: 3.5 }">
              </RankingPrize>
            </div>
          </div>
        </div>
        <p class="statement">
          {{ $t('inviterank.statement') }}
        </p>
        <div class="funBtnC">
          <div class="funBtn" @click="goInviteRankings">{{ $t('invite.activity.popup.btn') }}</div>
        </div>
      </van-popup>
      <IconBtn v-if="show" class="icon" wid="7" hei="3.4" :img-url="imgObj.cBImgUrl" @click="onClose"></IconBtn>
      <IconBtn v-if="activityPopShow" class="icon" wid="7" hei="3.4" :img-url="imgObj.cBImgUrl"
        @click="onActivityPopClose"></IconBtn>
    </div>
    <LoadPage v-else></LoadPage>
  </div>
</template>
<style scoped>
.inviteContainer {
  height: 100%;
  width: 100%;

  .content {
    padding: 0 3.7vw;
    background-color: #9611ba;
    height: auto;
    position: relative;
    padding-bottom: 1vh;
  }

  .IFBtn {
    position: fixed;
    bottom: 6vh;
    left: 9.8vw;
    width: 80.5vw;
    height: 4.7vh;
    background: linear-gradient(0deg, #9a56ff 0%, #ff8bfc 100%);
    border-radius: 1.8vw;
    border: 0;
    color: #ffffff;
    font-size: 4.2vw;

    .bSign {
      width: 34vw;
      height: 4vh;
      background-image: url('@/assets/image/invite/sign.png');
      background-size: 100% 100%;
      position: absolute;
      top: -2.5vh;
      right: -3vw;
      color: #ffffff;
      text-decoration: underline;
      line-height: 3vh;
      font-size: 3.9vw;
    }
  }

  .iPopup {
    width: 93vw;
    height: 52vh;
    background: linear-gradient(0, #ffffff 0%, #f8c8ff 100%);
    transform: translateY(-60%);
    padding: 2.5vh 2.8vw 3.3vh;
    border-radius: 2vw;

    .title {
      font-size: 5.7vw;
      color: #a017b6;
      text-align: center;
      margin-bottom: 1vh;
      font-weight: bold;
    }

    .iContent {
      height: 14vh;
      word-wrap: break-word;
      overflow-y: auto;
      text-wrap: wrap;
      font-size: 4vw;
      color: #9b739d;
      line-height: 2.3vh;
      background-color: #fff;
      padding: 2.5vh 2.6vw 3.4vh;
      margin-bottom: 2.9vh;
      border-radius: 2vw;
    }


    .funBtnC {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid #cba3d1;
      padding-bottom: 2.5vh;
      font-size: 4vw;
      font-weight: bold;

      .funBtn {
        width: 41vw;
        line-height: 4.5vh;
      }

      :nth-of-type(1) {
        border: 0.35vw solid #bb1bd8;
        text-align: center;
        color: #bb1bd8;
        border-radius: 2vw;
      }

      :nth-of-type(2) {
        text-align: center;
        color: #ffffff;
        background: linear-gradient(0, #9a56ff 0%, #ff8bfc 100%);
        border-radius: 2vw;
      }
    }

    .iShareApp {
      p {
        color: #9b739d;
        font-size: 4vw;
        text-align: center;
        line-height: 6vh;
      }

      .icon-container {
        display: flex;
        justify-content: space-between;
        padding: 0 1.5vw;

        >li {
          width: 10.8vw;
          height: 5vh;
        }
      }
    }
  }

  .activityPopup {
    width: 93vw;
    /* height: 52vh; */
    background: linear-gradient(0, #ffffff 0%, #f8c8ff 100%);
    transform: translateY(-60%);
    padding: 2.5vh 2.8vw 3.3vh;
    border-radius: 2vw;

    .title {
      font-size: 5.7vw;
      color: #a017b6;
      text-align: center;
      margin-bottom: 1vh;
      font-weight: bold;
    }

    .aContent {
      font-size: 4vw;
      color: #9b739d;
      line-height: 2.3vh;
      background-color: #fff;
      padding: 2.5vh 2.6vw 2vh;
      margin-bottom: 1vh;
      border-radius: 2vw;

      >p {
        font-weight: normal;
        font-size: 4.6vw;
        color: #E7A72F;
      }

      .award-container {
        margin-top: 1vh;
        padding: 0 2vw;

        .img-list {
          display: flex;
          align-items: center;
          justify-content: space-between;

          >div {
            position: relative;
            border-radius: 1.5vw;
            overflow: hidden;

            >span {
              max-width: 24vw;
              position: absolute;
              bottom: 0vh;
              left: 0vw;
              font-size: 3.4vw;
              color: #FFFFFF;
              text-shadow: 0px 1px 0px #000000;
              background: #000000;
              opacity: 0.52;
              overflow: hidden;
              /* 超出部分隐藏 */
              text-overflow: ellipsis;
              white-space: nowrap;
              /* 强制文本不换行 */
            }
          }
        }
      }
    }

    .statement {
      padding: 0 3vw;
      font-size: 3.7vw;
      color: #513C55;
      opacity: 0.92;
      margin-bottom: 2vh;
    }

    .funBtnC {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 4vw;
      font-weight: bold;

      .funBtn {
        width: 100%;
        line-height: 4.5vh;
        text-align: center;
        color: #ffffff;
        background: linear-gradient(0, #9a56ff 0%, #ff8bfc 100%);
        border-radius: 2vw;
      }
    }
  }

  .icon {
    position: fixed;
    bottom: 19.7vh;
    left: 0;
    right: 0;
    margin: 0 auto;
    z-index: 3000;
    /* 确保关闭按钮在弹窗之上 */
  }
}
</style>
