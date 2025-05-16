<script setup>
import { formatDate } from '@/utils/utils'
import InviteItem from './inviteItem.vue'
import { get_invite_mentees } from '@/api/invite'
import { ref } from 'vue'
const props = defineProps({
  data: {
    type: Object
  }
})
// 加载状态
const loading = ref(false);
// 是否加载结束
const finished = ref((props.data.mentee_count < 10) ? true : false);
// 当前页数
const current_page = ref(props.data.current_page)
// 徒弟列表
const inviteMentees = ref(props.data.mentees)

const onLoad = async () => {
  // 异步更新数据
  await get_invite_mentees({
    page: current_page.value += 1,
    last_create_time: inviteMentees.value.at(-1)['mentee_user_info']['create_time']
  }).then((result) => {
    console.log(result)
    if (result.code === 200) {
      inviteMentees.value.push(...result.data['mentees'])
      // 加载状态结束
      loading.value = false;
      if (result.data['mentee_count'] < 10) {
        finished.value = 0
      }
    } else {
    }
  })
};
</script>

<template>
  <div class="inviteContentDetail">
    <van-list class="van_list" v-model:loading="loading" loading-text="loading..." :finished="finished"
      :finished-text="$t('exchange.record.data_all')" @load="onLoad">
      <div v-for="item in inviteMentees">
        <!-- 头部信息 -->
        <div class="cHeader">
          <van-image class="avatarImage" lazy-load :src="item.mentee_user_info.user_avatar" />
          <div class="personInfo">
            <p class="name">{{ item.mentee_user_info.user_name }}</p>
            <p class="date">{{ formatDate(item.mentee_user_info.create_time) }}</p>
          </div>
        </div>
        <!-- 三阶段任务 -->
        <div class="cItems">
          <InviteItem v-for="task_item in item.mentee_tasks" :options="task_item"></InviteItem>
        </div>
      </div>
    </van-list>
  </div>
</template>
<style scoped>
.inviteContentDetail {
  .van_list {
    >div {
      padding: 1.5vh 3.6vw;
      border-radius: 2vw;
      background: linear-gradient(0deg, #f9e1ff 0%, #faf0fc 100%);
      margin-bottom: 2vh;

      .cHeader {
        display: flex;
        align-items: center;
        /* 垂直居中对齐 */
        border-radius: 5px;
        margin-bottom: 1vh;

        .avatarImage {
          width: 11.2vw;
          height: 5.2vh;
          border-radius: 50%;
          /* 使头像圆形 */
          margin-right: 3.7vw;
          /* 头像与文字间距 */
          overflow: hidden;
        }

        .personInfo {
          display: flex;
          flex-direction: column;

          /* 纵向排列名字和日期 */
          .name {
            max-width: 60vw;
            color: #a017b6;
            font-size: 4.4vw;
            font-weight: bold;
            overflow: hidden;
            /* 超出部分隐藏 */
            text-overflow: ellipsis;
            /* 超出部分显示省略号 */
          }

          .date {
            color: #bb7cc8;
            font-size: 3.4vw;
          }
        }
      }
    }
  }
}
</style>
