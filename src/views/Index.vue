<script setup>
import { RouterLink } from 'vue-router'

import { reactive, onMounted, onUnmounted } from 'vue'
import { importImg } from '@/utils/utils'

// 使用 import 引入图片
const imageUrlPortraitObj = {
  bg: importImg('image/index/bg.png'),
  btn: importImg('image/index/btn.png'),
}
const imageUrlLandscapeObj = {
  bg: importImg('image/index/bg2.png'),
  btn: importImg('image/index/btn2.png'),
}

// 响应式变量用于存储当前图片 URL
const currentImageUrlObj = reactive({
  bg: '',
  btn: '',
  logo: ''
})

// 更新图片 URL 的函数
const updateImageUrl = () => {
  const isPortrait = window.matchMedia('(orientation: portrait)').matches
  let obj = isPortrait ? imageUrlPortraitObj : imageUrlLandscapeObj
  currentImageUrlObj.bg = obj.bg
  currentImageUrlObj.btn = obj.btn
}

// 在组件挂载时和窗口尺寸变化时更新图片 URL
onMounted(() => {
  updateImageUrl()
  window.addEventListener('orientationchange', updateImageUrl)
  window.addEventListener('resize', updateImageUrl)
})

// 在组件卸载时清理事件监听器
onUnmounted(() => {
  window.removeEventListener('orientationchange', updateImageUrl)
  window.removeEventListener('resize', updateImageUrl)
})
</script>

<template>
  <div class="container">
    <van-image class="bg-image" lazy-load :src="currentImageUrlObj.bg" />
    <div class="btn">
      <a href="https://play.google.com/store/apps/details?id=com.fungameapp.pop.earn.cash">
        <van-image class="btn-image" fit="fill" lazy-load :src="currentImageUrlObj.btn" />
      </a>
      <br />
      <!-- <RouterLink to="/invite"> 邀请页面 </RouterLink><br />
      <RouterLink to="/inviteDetail"> 邀请详情页面 </RouterLink><br /> -->
      <!-- <RouterLink to="/test"> test </RouterLink> -->
    </div>
    <div class="protocol">
      Pop Cash 2025. All rights reserved.
      <RouterLink :to="{ name: 'clause', params: { name: 'useragreement' } }">
        <a href="#">Terms of Use</a>
      </RouterLink>
      /
      <RouterLink :to="{ name: 'clause', params: { name: 'privacypolicy' } }">
        <a href="#">Privacy Notice</a>
      </RouterLink>
      Help Center: fredrickboaz@gmail.com
    </div>
  </div>
</template>
<style scoped>
.container {
  width: 100%;
  height: 100%;
  overflow: hidden; /* 隐藏超出容器的内容 */
  /* 竖屏模式 */
  @media (orientation: portrait) {
    .bg-image {
      width: 100vw;
      height: 100vh;
    }
    .logo {
      position: absolute;
      left: 10.2vw;
      top: 4vh;
    }
    .logo-image {
      width: 32vw;
      height: 4.6vh;
    }
    .btn {
      position: absolute;
      left: 11.5vw;
      bottom: 19.2vh;
    }
    .btn-image {
      width: 76.8vw;
      height: 6.8vh;
    }
  }

  /* 横屏模式 */
  @media (orientation: landscape) {
    .bg-image {
      width: 100vw;
      height: 100vh;
    }
    .logo {
      position: absolute;
      left: 18.4vw;
      top: 4.2vh;
    }
    .logo-image {
      width: 13.2vw;
      height: 7.3vh;
    }
    .btn {
      position: absolute;
      left: 27.5vw;
      bottom: 15vh;
    }
    .btn-image {
      width: 45vw;
      height: 13.1vh;
    }
  }
  .protocol {
    position: absolute;
    width: 83.6vw;
    left: 10.9vw;
    bottom: 4.1vh;
    font-family: SourceHanSansCN-Regular;
    color: #eeeeee;
    font-size: 0.8rem;
    line-height: 2.4vh;
    text-align: center;
    a {
      color: #eeeeee;
      text-decoration: underline;
    }
  }
}
</style>
