import axios from "axios";
import {nanoid} from 'nanoid'
import qs from 'qs'
import { showToast,showFailToast } from 'vant';
import {useTokenStore} from '@/stores/tokenStore'
import config from "@/config";
const PACKAGE_NAME=config.packageName
// 允许设置最大重试次数
const MAX_RETRIES = 3;
const REQUEST_ID_KEY = 'X-Request-ID';
const abortControllerMap = new Map();
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_baseURL,
    timeout: 3000,
});

// 添加请求拦截器
axiosInstance.interceptors.request.use(function(config){
  const tokenStore = useTokenStore();
  const DEVICE_ID=tokenStore.device_id
    if(!(config._retryCount||0)>0){
      // url添加统一前缀
      config.url=config.url 
    }
    if (config.method==='get'){
      config.params = {
        'package_name':PACKAGE_NAME,
        'device_id':DEVICE_ID,
        ...config.params
      }
    }else{
      config.data = {
        'package_name':PACKAGE_NAME,
        'device_id':DEVICE_ID,
        ...config.data.data
      }
    }
    // 设置请求id,可注释
    const requestId = nanoid();
    config.headers[REQUEST_ID_KEY] = requestId
    // 添加token
    
    tokenStore.loadToken(); // 从 localStorage 加载 token
    if (tokenStore.token) {
      config.headers.Authorization = `Bearer ${tokenStore.token}`; // 添加 token 到请求头
    }
    // 添加取消请求的功能
    if (!config.signal) {
        const abortController = new AbortController();
        config.signal = abortController.signal;
        abortControllerMap.set(requestId, abortController);
    }
    // 查看 Accept 头
    const acceptHeader = config.headers['Accept'];
    // 根据 Accept 头设置 Content-Type
    if (acceptHeader) {
        if (acceptHeader.includes('application/json')) {
          config.headers['Content-Type'] = 'application/json';
        } else if (acceptHeader.includes('application/xml')) {
          config.headers['Content-Type'] = 'application/xml';
        } else {
          config.headers['Content-Type'] = 'text/plain'; // 默认值
        }
    }
    if(config.headers['Content-Type']==='application/x-www-form-urlencoded'){
        config.data = qs.stringify(config.data)
    }
    // 在发送请求之前做些什么
    return config
},function(error){
    // 对请求错误做些什么
    return Promise.reject(error)
})

axiosInstance.interceptors.response.use(function(response){
    console.log('response',response);
    // 2xx 范围内的状态码都会触发该函数。
    // 对响应数据做点什么
    // showToast(response.data.message);
    if (response.data?.code === 401){
      showFailToast({
          message:response.data.message
      });
    }
    return response.data;
},function(error){
    const originalRequest = error.config;
    // 超出 2xx 范围的状态码都会触发该函数。
    // 对响应错误做点什么
    // 如果请求失败且未达到最大重试次数
    // "ECONNABORTED"
    console.log('originalRequest._retryCount',originalRequest._retryCount);
    if (error.code === 'ECONNABORTED' && (originalRequest._retryCount || 0) < MAX_RETRIES) {
      originalRequest._retryCount = (originalRequest._retryCount || 0) + 1; // 递增重试次数
      console.log(`Request timed out. Retrying... (${originalRequest._retryCount})`);
      return axiosInstance(originalRequest); // 重新发送请求
    }
    
    console.log('error',error);
    showFailToast({
        message:error.response?(error.response.data.message?error.response.data.messag:error.message):error.message
    });
    return Promise.reject(error)
})


// 定义 API 请求方法
 const getData = async (endpoint) => {
  let params = "?package_name=test&device_id=test"
    return await axiosInstance.get('/api'+endpoint+params);
  };
  
   const postData = async (endpoint, data) => {
    return await axiosInstance.post('/api'+endpoint, data);
  };
  
  // 其他请求方法可以继续添加
   const deleteData = async (endpoint) => {
    return await axiosInstance.delete('/api'+endpoint);
  };
  
 const updateData = async (endpoint, data) => {
    return await axiosInstance.put('/api'+endpoint, data);
  };
  export { getData,postData,deleteData,updateData,axiosInstance, abortControllerMap };