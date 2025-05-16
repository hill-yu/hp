<script setup>
import { onMounted, computed, ref } from 'vue'
import Statistics from '@/components/invite/Statistics.vue'
import ICDetail from '@/components/inviteDetail/iCDetail.vue'
import { importImg } from '@/utils/utils'
import { useInviteStore } from '@/stores/invite'
import { get_invite_mentees } from '@/api/invite'
const inviteStore = useInviteStore()

// 使用 import 引入图片,不然打包的时候识别不了
const imgObj = {
  emptyStateUrl: importImg('image/exchange/emptyState.png')
}
// 邀请页面的信息
const inviteDatas = computed(() => {
  return inviteStore.inviteDatas
})
// 徒弟列表
const inviteMentees = ref(null)
onMounted(async () => {
  // 请求徒弟列表
  await get_invite_mentees().then((result) => {
    console.log(result)
    if (result.code === 200) {
      inviteMentees.value = result.data
    } else {
    }
  })
})
</script>

<template>
  <div class="inviteDetail">
    <Statistics :data="{
      mentee_count: inviteDatas.mentee_count,
      mentee_reward: inviteDatas.mentee_reward
    }"></Statistics>
    <div class="iDContainer">
      <div class="iDHeader">{{ $t('invite.detail.title') }}</div>
      <div class="iDContent" v-if="inviteMentees?.mentee_count">
        <ICDetail :data="inviteMentees"></ICDetail>
      </div>
      <!-- 无邀请记录数据 -->
      <div v-else-if="inviteMentees?.mentee_count == 0" class="empty">
        <van-image width="55vw" height="18vh" lazy-load :src="imgObj.emptyStateUrl" />
        {{ $t('invite.detail.data_empty') }}
      </div>
      <LoadPage v-else></LoadPage>
    </div>
  </div>
</template>
<style scoped>
.inviteDetail {
  padding: 2vh 3.7vw 2vh;
  background-color: #9611ba;
  min-height: 100vh;
  background-image: url('@/assets/image/inviteDetail/bg.png');
  background-repeat: no-repeat;
  background-size: 100% 61.5vh;

  .van-nav-bar {
    --van-nav-bar-background: 'transparent';
    margin-bottom: 2vh;
  }

  .iDContainer {
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
      top: 0;
      /* 外部边框的厚度 */
      left: 0;
      /* 外部边框的厚度 */
      right: 0;
      /* 外部边框的厚度 */
      bottom: 0;
      /* 外部边框的厚度 */
      border: 1.5vw solid #b14fcc;
      /* 外部边框 */
      border-radius: 3.5vw;
      /* 外部圆角，设置为内部圆角的值加上外部边框的厚度 */
    }

    .iDHeader {
      background-image: url('@/assets/image/invite/texture.png');
      background-size: 90.1vw 4.6vh;
      background-repeat: no-repeat;
      background-position: center;
      /* 背景图片居中 */
      color: #a017b6;
      font-size: 4.4vw;
      line-height: 4.6vh;
      text-align: center;
      font-weight: bold;
    }

    .iDContent {
      padding: 1.5vh 3vw;
    }

    .empty {
      min-height: 75vh;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      font-size: 4.2vw;
      color: #999999;
    }

    .overTip {
      text-align: center;
      font-size: 3vw;
      padding: 1vh 0;
      color: #999999;
    }
  }
}
</style>
