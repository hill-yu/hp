import { ref,computed } from 'vue'
import { defineStore } from 'pinia'
import { get_invite,get_rank_info,get_rank_history,get_rank_receive_feedback} from '@/api/invite'

export const useInviteStore = defineStore('invite', () => {
  // 邀请配置
  const inviteDatas = ref(null)
  async function getInvite() {
    try {
      
      return this.inviteDatas = (await get_invite()).data; // 替换为你的 API 地址
    } catch (err) {
      console.log(err);
      console.error('error,getInvite');
    } finally {
    }
  }
  // 邀请排行榜
  const rankInfo = ref(null)
  async function getRankInfo() {
    try {
      this.rankInfo = (await get_rank_info()).data; // 替换为你的 API 地址
    } catch (err) {
      console.log(err);
      console.error('error,getRankInfo');
    } finally {
    }
  }
  // 前三奖励配置
  const rewardFirstThree = computed(()=>{
    return ()=>{
      // 按照指定的顺序（2、1、3）进行排序
      let filteredItems = [...rankInfo.value.rank_config.reward_details.filter((item)=>[1, 2, 3].includes(item.rank))]
      const customOrder = [2, 1, 3]; // 自定义排序顺序
      filteredItems.sort((a, b) => {
        return customOrder.indexOf(a.rank) - customOrder.indexOf(b.rank);
      });
      return filteredItems
    }
  })
  // 第三之后的奖励配置
  const rewardAfterThird = computed(()=>{
    return ()=>{
      let filteredItems = [...rankInfo.value.rank_config.reward_details.filter((item)=>![1, 2, 3].includes(item.rank))]
      filteredItems.sort((a, b) => {
        return a.rank - b.rank;
      });
      return filteredItems
    }
  })
  // 前三名信息
  const rankFirstThree = computed(()=>{
    return ()=>{
      let filteredItems = [...rankInfo.value.rank_data.filter((item)=>[1, 2, 3].includes(item.rank))]
      const customOrder = [2, 1, 3]; // 自定义排序顺序
      filteredItems.sort((a, b) => {
        return customOrder.indexOf(a.rank) - customOrder.indexOf(b.rank);
      });
      return filteredItems
    }
  })
  // 第三名之后的信息
  const rankAfterThird = computed(()=>{
    return ()=>{
      let filteredItems = [...rankInfo.value.rank_data.filter((item)=>![1, 2, 3].includes(item.rank))]
      filteredItems.sort((a, b) => {
        return a.rank - b.rank;
      });
      return filteredItems
    }
  })
  // 获取往期邀请排行榜
  const rankHistory = ref(null)
  async function getRankHistory() {
    try {
      this.rankHistory = (await get_rank_history()).data; // 替换为你的 API 地址
    } catch (err) {
      console.log(err);
      console.error('error,getRankHistory');
    } finally {
    }
  }
  const cur_season_config = ref(null)
  // 历史排名前三名信息
  const rankDetailFirstThree = computed(()=>{
    return (filter)=>{
      cur_season_config.value = rankHistory.value.filter((item)=>item.season==filter.season)[0]
      let history_rank = cur_season_config.value.history_rank
      let filteredItems = [...history_rank.filter((item)=>[1, 2, 3].includes(item.rank))]
      filteredItems.sort((a, b) => {
        return a.rank - b.rank;
      });
      return filteredItems
    }
  })
  // 历史排名第三名之后的信息
  const rankDetailAfterThird = computed(()=>{
    return (filter)=>{
      let history_rank = rankHistory.value.filter((item)=>item.season==filter.season)[0].history_rank
      let filteredItems = [...history_rank.filter((item)=>![1, 2, 3].includes(item.rank))]
      filteredItems.sort((a, b) => {
        return a.rank - b.rank;
      });
      return filteredItems
    }
  })
  // 获取往期邀请排行榜领奖反馈
  const rankReceiveFeedback = ref(null)
  async function getRankReceiveFeedback() {
    try {
      this.rankReceiveFeedback = (await get_rank_receive_feedback()).data; // 替换为你的 API 地址
    } catch (err) {
      console.log(err);
      console.error('error,getRankReceiveFeedback');
    } finally {
    }
  }
  const changeRankReceiveFeedback = (id)=>{
    const item = rankReceiveFeedback.value.find((item) => item.award_id === id);
    if (item) {
      item.is_approve = true; // 修改状态
      item.approve_count +=1
    }
  }
  // 是否显示分享弹窗
  const showSharePopup = ref(false)
  const changeShowSharePopup = ()=>{
    showSharePopup.value = !showSharePopup.value
  }

  // 按钮是否禁用,用于控制邀请福利弹窗和新人奖励弹窗按钮
  const isButtonDisabled = ref(false)
  function setButtonDisabledStatus(){
    isButtonDisabled.value = !isButtonDisabled.value
    console.log(isButtonDisabled.value);
  }
  return {inviteDatas,isButtonDisabled,rankInfo,rewardFirstThree,rewardAfterThird,
    rankAfterThird,rankFirstThree,rankHistory,rankReceiveFeedback,rankDetailFirstThree,rankDetailAfterThird,cur_season_config,showSharePopup,
    getInvite,setButtonDisabledStatus,getRankInfo,getRankHistory,getRankReceiveFeedback,changeRankReceiveFeedback,changeShowSharePopup
  }
})

