import {axiosInstance} from '@/utils/http'

// 获取邀请页信息
export const get_invite = ()=>{
    return axiosInstance.get('/social/invite')
}
// 获取邀请页拜师页信息
export const get_invite_bind = ()=>{
    return axiosInstance.get('/social/invite/bind')
}
// 获取邀请页拜师页信息3.0
export const get_invite_bind_3_0 = ()=>{
    return axiosInstance.get('/social/invite/bind/3_0')
}
// 查看徒弟信息
export const get_invite_mentees = (params)=>{
    return axiosInstance.get('/social/invite/mentees',{params})
}
// 获取落地页自动拜师谷歌商店安装地址
export const get_share_store = (params)=>{
    return axiosInstance.get('/social/share/store',{params})
}
// 获取邀请福利和新人奖励是否领取
export const get_invite_welfare = ()=>{
    return axiosInstance.get('/social/invite/welfare')
}
// 获取邀请排行榜
export const get_rank_info = ()=>{
    return axiosInstance.get('/social/invite/rank_info')
}
// 获取往期邀请排行榜
export const get_rank_history = ()=>{
    return axiosInstance.get('/social/invite/rank_history')
}
// 获取往期邀请排行榜领奖反馈
export const get_rank_receive_feedback = ()=>{
    return axiosInstance.get('/social/invite/receiving_feedback')
}
// 获取奖励统计
export const get_rank_award_total = ()=>{
    return axiosInstance.get('/social/invite/award_total')
}


// 绑定邀请码
export const post_invite_bind = (data)=>{
    return axiosInstance.post('/social/invite/bind',{data})
}
// 绑定邀请码3.0
export const post_invite_bind_3_0 = (data)=>{
    return axiosInstance.post('/social/invite/bind/3_0',{data})
}
// 手动领取新人奖励
export const post_newcomer_reward = (data)=>{
    return axiosInstance.post('/social/newcomer/reward',{data})
}
// 领取邀请福利奖励
export const post_invite_welfare_reward = (data)=>{
    return axiosInstance.post('/social/invite/welfare/reward',{data})
}
// 点赞
export const post_invite_approve = (data)=>{
    return axiosInstance.post('/social/invite/approve',{data})
}