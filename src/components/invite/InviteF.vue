<script setup>
import IconBtn from '@/components/public/IconBtn.vue'
import { importImg } from '@/utils/utils'
// 使用 import 引入图片,不然打包的时候识别不了
const imgObj = {
  lImgUrl: importImg('image/invite/copy-ic.png'),
  aFImgUrl: importImg('image/invite/add-friend-ic.png'),
  gImgUrl: importImg('image/invite/game-ic.png')
}
</script>

<template>
  <div class="inviteF">
    <div class="iFHeader">{{ $t('invite.how_invite_friend') }}</div>
    <div class="iFContent">
      <div class="iFCItem">
        <IconBtn class="icon" wid="4.9" hei="2.3" :img-url="imgObj.lImgUrl"></IconBtn>
        <p>{{ $t('invite.hIF_conten_one') }}</p>
      </div>
      <div class="iFCItem">
        <IconBtn class="icon" wid="5.7" hei="2.4" :img-url="imgObj.aFImgUrl"></IconBtn>
        <p>{{ $t('invite.hIF_conten_two') }}</p>
      </div>
      <div class="iFCItem">
        <IconBtn class="icon" wid="5.2" hei="2.3" :img-url="imgObj.gImgUrl"></IconBtn>
        <p>{{ $t('invite.hIF_conten_three') }}</p>
      </div>
    </div>
  </div>
</template>
<style scoped>
.inviteF {
  background-color: #ffffff;
  border: 1px solid #fff;
  border-radius: 3.5vw;
  margin-bottom: 2vh;
  position: relative;
  padding: 0.6vh 0.8vw;
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
  .iFHeader {
    background-image: url('@/assets/image/invite/texture.png');
    background-size: 90.1vw 4.6vh;
    background-repeat: no-repeat;
    background-position: center; /* 背景图片居中 */
    color: #a017b6;
    font-size: 4.4vw;
    line-height: 4.6vh;
    text-align: center;
    font-weight: bold;
  }
  .iFContent {
    padding: 2.5vh 4vw 0;
    .iFCItem {
      display: flex;
      justify-content: space-between;
      margin-bottom: 3vh;
      .icon {
        flex: 1 1 auto;
        width: 5vw;
      }
      p {
        color: #a017b6;
        font-size: 3.9vw;
        flex: 1 1 85%;
      }
    }
  }
}
</style>
