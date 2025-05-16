// src/config.js
export default {
    appName: 'Pop Cash',
    version: '1.0.0', // 还未使用
    releaseDate: 'May 15, 2025', // 用户协议与隐私政策配置
    packageName: 'com.fungameapp.pop.earn.cash', // app的包名,用于请求的必传参数使用
    appKey:'gomatchkey', // 与APP交互约定的key
    bindReward: 10000, // 绑定奖励的金额
    dayCash: '₱40', // 一天通过所有关卡看获得的金额
    requestUrl:'https://api.gomatchapp.net/api/v1/', // 正式环境请求呃URL，目前未使用，因为配置了环境变量
    langObj : {
      "en":'en',
      "fil":'fil_ph'
    }
  };