<script setup>
import IconBtn from '@/components/public/IconBtn.vue'
import router from '@/router'
import { importImg } from '@/utils/utils'
// 使用 import 引入图片,不然打包的时候识别不了
const imgObj = {
  rImgUrl: importImg('image/invite/right-icon.png'),
  fImgUrl: importImg('image/invite/friend-icon.png'),
  cImgUrl: importImg('image/invite/coins-icon.png')
}
const props = defineProps({
  isSkip: {
    type: Boolean,
    default: false // 设置默认值
  },
  data: {
    type: Object
  }
})
function goInviteDetail() {
  router.push('/inviteDetail')
}
</script>

<template>
  <div>
    <van-row class="statistics" align="center">
      <van-col class="col" span="12">
        <div>
          <span class="num">{{ props.data.mentee_count }}</span>
          <IconBtn
            v-if="props.isSkip"
            wid="1.5"
            hei="1.3"
            :img-url="imgObj.rImgUrl"
            @click="goInviteDetail"
          >
          </IconBtn>
        </div>
        <div>
          <IconBtn wid="4" hei="1.7" :img-url="imgObj.fImgUrl"></IconBtn>
          <span>{{ $t('invite.good_friend') }}</span>
        </div>
      </van-col>
      <van-col class="col" span="12">
        <div>
          <span class="num">{{ props.data.mentee_reward ? props.data.mentee_reward : 0 }}</span>
        </div>
        <div>
          <IconBtn wid="2.8" hei="1.6" :img-url="imgObj.cImgUrl"></IconBtn>
          <span>{{ $t('invite.income') }}</span>
        </div>
      </van-col>
    </van-row>
  </div>
</template>
<style scoped>
.statistics {
  height: 10vh;
  background-color: #ffffff;
  border: 1px solid #fff;
  border-radius: 3.5vw;
  margin-bottom: 2vh;
  position: relative;
  &::before {
    content: '';
    position: absolute;
    top: 0; /* 外部边框的厚度 */
    left: 0; /* 外部边框的厚度 */
    right: 0; /* 外部边框的厚度 */
    bottom: 0; /* 外部边框的厚度 */
    border: 1.5vw solid #b14fcc; /* 外部边框 */
    border-radius: 3.5vw; /* 外部圆角，设置为内部圆角的值加上外部边框的厚度 */
    pointer-events: none; /* 允许点击穿透 */
  }
  .col {
    &:first-child {
      /* border-right: #e7d7ea; */
      border-right: 1px solid #e7d7ea;
    }
    > div {
      display: flex;
      justify-content: center;
      flex-wrap: nowrap;
      .num {
        font-size: 6vw;
        font-weight: bolder;
        color: #a017b6;
        margin-right: 2vw;
      }
    }
    > div:nth-child(1) {
      align-items: center;
    }
    > div:nth-child(2) {
      height: 1.7vh;
      span {
        color: #bb7cc8;
        font-size: 3.3vw;
        overflow: hidden;
        line-height: 100%;
        height: 100%;
        padding-left: 1vw;
      }
    }
  }
}
</style>
