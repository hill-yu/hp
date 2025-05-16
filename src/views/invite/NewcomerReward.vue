<script setup>
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { showFailToast } from 'vant'
import { importImg, docuLocation, formatNumber } from '@/utils/utils'
import { useLangStore } from '@/stores/lang'
import { get_invite_bind, get_invite_bind_3_0, post_invite_bind, post_invite_bind_3_0, post_newcomer_reward } from '@/api/invite'
import Ipopup from '@/components/invite/Ipopup.vue'
import { useInviteStore } from '@/stores/invite'
const inviteStore = useInviteStore()
const { t, locale } = useI18n()
const isBind = ref(false)
// 是否显示弹窗
const showPopup = ref(false)
const PopupType = ref(0)
const PopupData = ref(null)
// 使用 import 引入图片,不然打包的时候识别不了
const imgObj = {
  coinsUrl: importImg('image/newReward/coins.png'),
  coinsSuccessUrl: importImg('image/newReward/coin_success.png'),
}
// 判断显示图片
const isReceive = ref(0)
const dynamicData = ref(null)
const fontSize = ref('3.7vw') // 默认字体大小
const inputValue = ref('') // 用于绑定输入值
const { language, version } = useLangStore()
const inviteBind = ref(null)
onMounted(async () => {
  // 加载语言
  locale.value = language
  // 新增版本参数，根据版本走不通的业务逻辑
  // 如果有版本参数，则需要手动领取新人奖励；否则，拜完师自动领取新人奖励
  if (version) {
    await get_invite_bind_3_0().then((result) => {
      if (result.code === 200) {
        inviteBind.value = result.data
        // 判断是否有邀请码，如果有，代表已经拜师
        if (inviteBind.value.mentor_invite_code) {
          isBind.value = true
          inputValue.value = inviteBind.value.mentor_invite_code
          fontSize.value = '9vw' // 根据输入长度动态调整字体大小
          // 判断是否已领取奖励，0：待领取，null为过往用户，1：已领取
          if (inviteBind.value.is_receive == 0) {
            console.log('弹出领取奖励弹窗');
            showPopup.value = true
            PopupData.value = { 'popType': PopupType.value, 'coin': inviteBind.value.bind_coins, 'ad_conin': inviteBind.value.bind_ad_coins }
            dynamicData.value = {
              headTitle: t('newcomer.header.title_three'),
              title: t('newcomer.content.title_two')
            }
            isReceive.value = 0
          } else {
            dynamicData.value = {
              headTitle: t('newcomer.header.title_two'),
              title: t('newcomer.content.title_two')
            }
            isReceive.value = 1
          }
        } else {
          dynamicData.value = {
            // 使用 import 引入图片,不然打包的时候识别不了
            headTitle: t('newcomer.header.title_one'),
            title: t('newcomer.content.title_one')
          }
          isReceive.value = 0
        }
      }
    })
  } else {
    await get_invite_bind().then((result) => {
      if (result.code === 200) {
        inviteBind.value = result.data
        if (inviteBind.value.mentor_invite_code) {
          isBind.value = true
          inputValue.value = inviteBind.value.mentor_invite_code
          fontSize.value = '9vw' // 根据输入长度动态调整字体大小
          dynamicData.value = {
            headTitle: t('newcomer.header.title_two'),
            title: t('newcomer.content.title_two')
          }
          isReceive.value = 1
        } else {
          dynamicData.value = {
            // 使用 import 引入图片,不然打包的时候识别不了
            headTitle: t('newcomer.header.title_one'),
            title: t('newcomer.content.title_one')
          }
          isReceive.value = 0
        }
      }
    })
  }
  docuLocation('show')
})
// 定义监听输入input事件，修改样式
const onInput = () => {
  if (inputValue.value.length > 0) {
    fontSize.value = '9vw' // 根据输入长度动态调整字体大小
  } else {
    fontSize.value = '3.7vw' // 如果没有输入，恢复默认大小
  }
}
// 定义保存按钮事件
// 新增版本参数，根据版本走不通的业务逻辑
// 如果有版本参数，则需要手动领取新人奖励；否则，拜完师自动领取新人奖励
const save = async () => {
  if (version) {
    if (inputValue.value != '') {
      const request_data = {
        mentor_invite_code: inputValue.value
      }
      console.log('request_data', request_data)
      await post_invite_bind_3_0(request_data).then((result) => {
        if (result.code === 200) {
          isBind.value = true
          fontSize.value = '9vw' // 根据输入长度动态调整字体大小
          // 要修改成待领取
          dynamicData.value = {
            headTitle: t('newcomer.header.title_three'),
            title: t('newcomer.content.title_two')
          }
          isReceive.value = 0
          showPopup.value = true
          PopupData.value = { 'popType': PopupType.value, 'coin': inviteBind.value.bind_coins, 'ad_conin': inviteBind.value.bind_ad_coins }
        } else {
          showFailToast({
            message: 'Bind fail'
          })
        }
      })
    }
  } else {
    if (inputValue.value != '') {
      const request_data = {
        mentor_invite_code: inputValue.value
      }
      console.log('request_data', request_data)
      await post_invite_bind(request_data).then((result) => {
        if (result.code === 200) {
          const is_bind_params = `is_bind=1`
          docuLocation(is_bind_params)
          isBind.value = true
          fontSize.value = '9vw' // 根据输入长度动态调整字体大小
          dynamicData.value = {
            headTitle: t('newcomer.header.title_two'),
            title: t('newcomer.content.title_two')
          }
          isReceive.value = 1
        } else {
          showFailToast({
            message: 'Bind fail'
          })
        }
      })
    }
  }
}
// 看广告后额外领取金币和新人奖励
const viewADToApp = () => {
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
    receiveReward(1)
  } else {
    showFailToast({
      message: t('invite.popup_wel.toast.ad_fail')
    })
    inviteStore.setButtonDisabledStatus()
  }
}
// 暴露给APP应用使用
window.takeOverApp = takeOverApp

// 领取奖励事件
const receiveReward = async (is_view_ad) => {
  const request_data = {
    is_view_ad: is_view_ad
  }
  console.log('request_data', request_data);
  // 请求接口,领取新人奖励
  await post_newcomer_reward(request_data).then((result) => {
    console.log('result', result);
    if (result?.code == 200) {
      // 要通知APP更新资产
      docuLocation(`update_asset=1`)
      PopupType.value = 2
      PopupData.value = { 'popType': PopupType.value, 'coin': result.data['add_coin'] }
      console.log('PopupData', PopupData);

      dynamicData.value = {
        headTitle: t('newcomer.header.title_two'),
        title: t('newcomer.content.title_two')
      }
      isReceive.value = 1
    } else {
      showFailToast({
        message: t('newcomer.toast.receive_fail')
      })
      inviteStore.setButtonDisabledStatus()
    }

  }).catch((error) => {
    console.log('error', error);
    showFailToast({
      message: 'service error'
    })
    inviteStore.setButtonDisabledStatus()
  })
}
// 关闭领取新人奖励弹窗
const closePopup = () => {
  showPopup.value = false
}

</script>

<template>
  <div class="NewRewardContainer" v-if="inviteBind">
    <!-- 头部 -->
    <div class="header">
      <p>{{ dynamicData.headTitle }}</p>
      <p>
        <span :class="isReceive == 0 ? 'addStyle' : ''">+{{ formatNumber(inviteBind.bind_coins) }}</span> <span>{{
          $t('invite.coin') }}</span>
      </p>
      <van-image v-if="isReceive == 0" class="imgCon" width="30vw" fit="fill" lazy-load :src="imgObj.coinsUrl" />
      <van-image v-else class="imgCon" width="19.5vw" fit="fill" lazy-load :src="imgObj.coinsSuccessUrl" />
    </div>
    <!-- 内容 -->
    <div class="content">
      <h3 class="title">{{ dynamicData.title }}</h3>
      <input type="text" :placeholder="$t('newcomer.content.input')" :style="{ fontSize }" @input="onInput"
        v-model="inputValue" :disabled="isBind" />
      <div>
        <span>!</span>
        <p>{{ $t('newcomer.content.notice') }}</p>
      </div>
      <div>
        <span>!</span>
        <p>{{ $t('newcomer.content.notice1') }}</p>
      </div>
      <div>
        <span>!</span>
        <p>{{ $t('newcomer.content.notice2') }}</p>
      </div>
            <div>
        <span>!</span>
        <p>{{ $t('newcomer.content.notice3') }}</p>
      </div>
    </div>
    <!-- 保存按钮 -->
    <van-button v-if="!isBind" class="saveBtn" @click="save">{{ $t('newcomer.btn') }}</van-button>
    <!-- 手动领取新人奖励弹窗 -->
    <Ipopup :popShow=showPopup :data=PopupData @receiveReward="receiveReward" @viewADReceive="viewADToApp"
      @closePopup="closePopup">
    </Ipopup>
  </div>
  <LoadPage v-else></LoadPage>
</template>
<style scoped>
.NewRewardContainer {
  padding: 0 3.5vw;

  .header {
    width: 93vw;
    height: 13.6vh;
    border-radius: 2vw;
    background: linear-gradient(-90deg, #9F17B6 0%, #D26AEB 100%);
    border: 1px solid #555;
    /* overflow: hidden; */
    position: relative;

    >p:nth-child(1) {
      font-weight: bolder;
      margin-top: 1.8vh;
      margin-left: 6vw;
      font-size: 6vw;
      color: #ffffff;
      text-shadow: 0px 2px 1px rgba(141, 73, 13, 0.56);
    }

    >p:nth-child(2) {
      margin-left: 6vw;

      >span:nth-child(1) {
        font-weight: bolder;
        font-size: 6vw;
        color: #fff780;
      }

      >span:nth-child(2) {
        font-size: 3.5vw;
        color: #f9d9ff;
      }

      .addStyle {
        position: relative;
        z-index: 10;

        &::after {
          content: '';
          width: 24vw;
          height: 1vh;
          display: inline-block;
          background-color: #D828FF;
          position: absolute;
          bottom: 0;
          right: 0;
          z-index: -1;
        }
      }
    }

    .imgCon {
      position: absolute;
      right: 0;
      bottom: 0vh;
    }
  }

  .content {
    margin-top: 5vh;
    margin-bottom: 7vh;
    border: 1px solid #555;
    border-radius: 2vw;
    padding: 3vh 6.2vw;
    background-color: #ffffff;

    .title {
      color: #333333;
      font-size: 5vw;
      margin-bottom: 2.7vh;
    }

    >input {
      width: 76vw;
      height: 5.8vh;
      background: #e1f9ff;
      border-radius: 1.8vw;
      border: 1px solid #91adb4;
      margin-bottom: 1.6vh;
      font-weight: bold;
      color: #485c61;
      text-align: center;
    }

    /* 设置 placeholder 的字体大小 */
    >input::placeholder {
      font-size: 3.7vw;
      color: #999;
      line-height: 1;
    }

    >div {
      font-size: 3.5vw;
      color: #999999;
      position: relative;
      display: flex;
      justify-content: space-between;

      >span {
        display: inline-block;
        color: #ffc04a;
        border: 0.6vw solid #ffc04a;
        border-radius: 50%;
        font-size: 12px;
        width: 3.3vw;
        height: 1.6vh;
        text-align: center;
        font-weight: bold;
        border-radius: 50%;
        line-height: 1.8vh;
      }

      p {
        flex: 1;
        margin-left: 2vw;
      }
    }
  }

  .saveBtn {
    width: 93vw;
    height: 5.2vh;
    background: linear-gradient(0deg, #46b000 0%, #56d801 100%);
    border-radius: 1.8vw;
    font-size: 4.3vw;
    font-weight: bolder;
    color: #ffffff;
  }
}
</style>
