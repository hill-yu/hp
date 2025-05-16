<script setup>
import IconBtn from '@/components/public/IconBtn.vue'
import { importImg } from '@/utils/utils'
// 使用 import 引入图片,不然打包的时候识别不了
const imgObj = {
  c1ImgUrl: importImg('image/invite/10000coins-ic.png'),
  c2ImgUrl: importImg('image/invite/20000coins-ic.png'),
  c3ImgUrl: importImg('image/invite/30000coins-ic.png')
}
const props = defineProps({
  invite_coins_stage: {
    type: Object
  }
})
</script>

<template>
  <div class="RewardDis">
    <div class="rDHeader">
      <p>{{ $t('invite.award_title') }}</p>
    </div>
    <div class="rDItem item-first">
      <div>{{ $t('invite.award_conten_one') }}</div>
      <div>
        <div>
          <IconBtn class="icon" wid="6.2" hei="3.8" :img-url="imgObj.c1ImgUrl"></IconBtn>
        </div>
        <span>+{{ invite_coins_stage[0] }}</span>
      </div>
    </div>
    <div class="rDItem">
      <div>{{ $t('invite.award_conten_two') }}</div>
      <div>
        <div>
          <IconBtn class="icon" wid="7.1" hei="3" :img-url="imgObj.c2ImgUrl"></IconBtn>
        </div>
        <span>+{{ invite_coins_stage[1] }}</span>
      </div>
    </div>
    <div class="rDItem">
      <div>{{ $t('invite.award_conten_three') }}</div>
      <div>
        <div>
          <IconBtn class="icon" wid="7.1" hei="3" :img-url="imgObj.c3ImgUrl"></IconBtn>
        </div>
        <span>+{{ invite_coins_stage[2] }}</span>
      </div>
    </div>
  </div>
</template>
<style scoped>
.RewardDis {
  /* height: 44vh; */
  background-color: #ffffff;
  border: 1px solid #fff;
  border-radius: 3.5vw;
  margin-bottom: 2vh;
  position: relative;
  padding: 0.5vh 0;
  ::before {
    content: '';
    position: absolute;
    top: 0; /* 外部边框的厚度 */
    left: 0; /* 外部边框的厚度 */
    right: 0; /* 外部边框的厚度 */
    bottom: 0; /* 外部边框的厚度 */
    border: 1.5vw solid #b14fcc; /* 外部边框 */
    border-radius: 3.5vw; /* 外部圆角，设置为内部圆角的值加上外部边框的厚度 */
  }
  .rDHeader {
    background-image: url('@/assets/image/invite/texture2.png');
    background-size: 90vw 7.2vh;
    background-repeat: no-repeat;
    background-position: center; /* 背景图片居中 */
    color: #a017b6;
    font-size: 4.4vw;
    height: 7.2vh;
    display: flex;
    justify-content: center;
    align-items: center;
    p {
      line-height: 2.4vh;
      width: 69vw;
      text-align: center;
      font-weight: bold;
      margin-top: 0.2vh;
    }
  }
  .rDItem {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 2vh 6.7vw 0;
    padding-bottom: 1.5vh;
    border-bottom: 1px solid #e7d7ea;
    > div {
      > div {
        display: flex;
        align-items: center;
        justify-content: center;
        flex: 2;
      }
      span {
        display: inline-block;
        color: #ffffff;
        font-size: 3.5vw;
        width: 15.8vw;
        /* height: 2.4vh; */
        background: #e7a72f;
        border-radius: 1.2vw;
        text-align: center;
        line-height: 2.5vh;
        flex: 1;
      }
    }
    > div:nth-child(1) {
      color: #a017b6;
      flex: 1 1 65%;
      font-size: 3.9vw;
    }
    > div:nth-child(2) {
      background: #faeefc;
      border-radius: 50%;
      width: 17vw;
      height: 8vh;
      display: flex;
      flex-direction: column; /* 子项从上到下排列 */
    }
  }
  .item-first {
    margin-top: 2vh;
  }
}
</style>
