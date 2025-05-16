import {axiosInstance} from '@/utils/http'

export const get_game_asset_exchange = ()=>{
    return axiosInstance.get('/funds/game/exchange')
}
export const get_game_balance = ()=>{
    return axiosInstance.get('/funds/game/balance')
}
export const get_exchange_record = ()=>{
    return axiosInstance.get('/funds/game/exchange/records')
}
// 游戏出款的提现填写字段信息获取接口
export const get_game_payout = (params)=>{
    return axiosInstance.get('/funds/game/payout',{params})
}
// 实时支付
export const get_game_payout_sync = (params)=>{
    return axiosInstance.get('/funds/game/payout/sync',{params})
}

// post
// 游戏出款的提现申请接口
export const post_game_payout = (data)=>{
    return axiosInstance.post('/funds/game/payout/apply',{data})
}

