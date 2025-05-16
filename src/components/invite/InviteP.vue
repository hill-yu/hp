<script setup></script>

<template>
  <div class="invitePro">
    <div class="iPHeader">{{ $t('invite.tips_title') }}</div>
    <div class="iPContent">
      <div class="iPCItem">
        <span>1</span>
        <p>{{ $t('invite.tip_content_one') }}</p>
      </div>
      <div class="iPCItem">
        <span>2</span>
        <p>{{ $t('invite.tip_content_two') }}</p>
      </div>
      <div class="iPCItem">
        <span>3</span>
        <p>{{ $t('invite.tip_content_three') }}</p>
      </div>
      <div class="iPCItem">
        <span>4</span>
        <p>{{ $t('invite.tip_content_four') }}</p>
      </div>
      <div class="iPCNotice">
        <span>!</span>
        <p>{{ $t('invite.notice') }}</p>
      </div>
    </div>
  </div>
</template>
<style scoped>
.invitePro {
  height: auto;
  background-color: #ffffff;
  border: 1px solid #fff;
  border-radius: 3.5vw;
  margin-bottom: 2vh;
  position: relative;
  padding: 0.6vh 0.8vw;
  &::before {
    content: '';
    position: absolute;
    top: 0; /* 外部边框的厚度 */
    left: 0; /* 外部边框的厚度 */
    right: 0; /* 外部边框的厚度 */
    bottom: 0; /* 外部边框的厚度 */
    border: 1.5vw solid #b14fcc; /* 外部边框 */
    border-radius: 3.5vw; /* 外部圆角，设置为内部圆角的值加上外部边框的厚度 */
  }
  .iPHeader {
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
  .iPContent {
    height: auto;
    padding: 2.5vh 5.8vw 8vh;
    .iPCItem {
      position: relative;
      margin-bottom: 2.5vh;
      span {
        display: inline-block;
        background-color: #9611ba;
        color: #fff;
        width: 4.9vw;
        height: 2.3vh;
        text-align: center;
        border-radius: 50%;
        line-height: 2.3vh;
        position: absolute;
        top: 0vh;
        left: 1vw;
      }
      p {
        color: #a017b6;
        font-size: 3.9vw;
        text-indent: 8vw;
        word-wrap: break-word;
      }
    }
    .iPCNotice {
      position: relative;
      span {
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
        position: absolute;
        top: 0.2vh;
        left: 1.5vw;
      }
      p {
        color: #ffc04a;
        font-size: 3.9vw;
        text-indent: 8vw;
      }
    }
  }
}
</style>
