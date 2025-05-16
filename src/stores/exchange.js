import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { get_game_asset_exchange, get_game_balance ,get_exchange_record,get_game_payout} from '@/api/exchange'

export const useExchangeStore = defineStore('exchange', () => {
  // 兑换配置
  const exchangeDatas = ref(null)
  const loading = ref(false);
  const error = ref(null);
   // 过滤后单条数据
  const exchangeData = computed(()=>{
    return (filter)=>{
      console.log("filter",filter);
      return exchangeDatas.value?exchangeDatas.value[filter.title].filter((item)=>item.id===filter.id):null
    }
  })
  // 支付提供商列表
  const exchangePayoutList = computed(()=>{
    console.log('exchangeDatas.value',exchangeDatas.value);
    return ()=>{
      let PayoutList = []
      for (let [key, value] of Object.entries(exchangeDatas.value)) {
        let PayoutObj = {
          'payoutName':key,
          'payoutIcon':value[0]['exchange_payout_target_icon']
        }
        PayoutList.push(PayoutObj)
      }
      return PayoutList
    }
  })
  // 通过支付提供商过滤的兑换配置
  const exchangeDataByProvider = computed(()=>{
    return (filter)=>{
      return exchangeDatas.value?exchangeDatas.value[filter.title]:null
    }
  })
  function setExchangeDate(data){
    this.exchangeDatas = data
  }
  // 获取兑换配置
  async function getExchangeData() {
    loading.value = true;
    error.value = null;
    try {
      const response = await get_game_asset_exchange(); // 替换为你的 API 地址
      this.exchangeDatas = response.data;
    } catch (err) {
      error.value = 'Failed to fetch data';
      console.error(err);
    } finally {
      loading.value = false;
    }
  }
  // 获取兑换记录
  const exchangeRecord = ref(null)
  async function getExchangeRecord() {
    loading.value = true;
    error.value = null;
    try {
      const response = await get_exchange_record(); // 替换为你的 API 地址
      this.exchangeRecord = response.data;
    } catch (err) {
      error.value = 'Failed to fetch data';
      console.error(err);
    } finally {
      loading.value = false;
    }
  }
  // 是否同意兑换协议
  const isExchangeProtocol = localStorage.getItem('isExchangeProtocol')?localStorage.getItem('isExchangeProtocol'):ref('false')
  function setIsExPro(){
    localStorage.setItem('isExchangeProtocol',true)
    this.isExchangeProtocol = true
  }
  // 游戏出款的提现填写字段信息获取接口
  const payoutData = ref(null)
  async function getPayout(params) {
    try {
      this.payoutData = (await get_game_payout(params)).data; // 替换为你的 API 地址
    } catch (err) {
      console.log(err);
      
      console.error('error,getPayout');
    } finally {
    }
  }

  return { exchangeDatas,exchangeData,exchangeRecord,isExchangeProtocol,payoutData,exchangePayoutList,exchangeDataByProvider,
    setExchangeDate,getExchangeData,getExchangeRecord,setIsExPro,getPayout,
  }
})

