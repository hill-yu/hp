<script setup>
import { ref } from 'vue'
import { showToast } from 'vant'
import { useI18n } from 'vue-i18n'
import IconBtn from '../public/IconBtn.vue'
import { importImg, docuLocation } from '@/utils/utils'
const { t } = useI18n() // 获取 t 函数和 locale
const contentToCopy = ref(null)
const props = defineProps({
  data: {
    type: Object
  }
})
const copyContent = async () => {
  const content_params = `content=${contentToCopy.value.innerText}`
  showToast({
    message: t('invite.copy_success')
  })
  docuLocation(content_params)
}
// 使用 import 引入图片,不然打包的时候识别不了
const imgObj = {
  cIImgUrl: importImg('image/invite/copy-icon.png')
}
</script>

<template>
  <div class="iHeader">
    <div class="limiteTime_con">
      <p class="limiteTime trace-limite">{{ $t('invite.invite_friend') }}</p>
    </div>
    <div class="prizes">
      <span>{{ props.data.coins }}</span>
    </div>
    <div class="currency">
      <span>{{ $t('invite.coin') }}</span>
    </div>
    <div class="inviteCode">
      <span>{{ $t('invite.code') }}:</span>
      <span style="margin-left: 1vw; margin-right: 3vw" ref="contentToCopy">
        {{ props.data.code }}
      </span>
      <IconBtn wid="3.2" hei="1.5" :img-url="imgObj.cIImgUrl" @Click="copyContent"></IconBtn>
    </div>
  </div>
</template>
<style scoped>
.iHeader {
  width: 100vw;
  height: 41.5vh;
  background-image: url('@/assets/image/invite/bg-top.png');
  background-repeat: no-repeat;
  background-size: 100% 41.5vh;
  position: relative;
  .limiteTime_con {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 10vh;
    padding: 3.3vh 5vw 0;
    .limiteTime {
      text-align: center;
      font-size: 7.2vw;
      color: #fffcff;
      font-weight: bold;
      transform: rotate(3deg);
    }
    .trace-limite {
      --text-size: 7.2vw;
      font-size: var(--text-size);
      text-shadow:
        1vw 0 0 #ffc000,
        -1vw 0 0 #ffc000,
        0 1vw 0 #ffc000,
        0 -1vw 0 #ffc000,
        0.7vw 0.7vw 0 #ffc000,
        -0.7vw 0.7vw 0 #ffc000,
        0.7vw -0.7vw 0 #ffc000,
        -0.7vw -0.7vw 0 #ffc000;
    }
  }
  .prizes {
    text-align: center;
    margin-top: 2vh;
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
  .inviteCode {
    width: 100%;
    background-image: url('@/assets/image/invite/base-frame.png');
    background-repeat: no-repeat;
    background-position: center; /* 背景图片居中 */
    background-size: 61.6vw 3.7vh;
    text-align: center;
    line-height: 3.7vh;
    position: absolute;
    bottom: 6vh;
    span {
      font-size: 3.7vw;
      color: #fff5ff;
      text-shadow: 0px 0.17vh 0.08vw rgba(141, 73, 13, 0.56);
    }
  }
}
</style>
