// src/stores/tokenStore.js
import { defineStore } from 'pinia';
import { ref } from 'vue'

export const useTokenStore = defineStore('token', ()=>{
    const token = ref(null);
    const device_id = ref('')
    function setToken(newToken,deviceId) {
        this.token = newToken
        this.device_id = deviceId
        localStorage.setItem('token', newToken); // 存储到 localStorage
    }
    function loadToken() {
        this.token = localStorage.getItem('token'); // 从 localStorage 加载
    }
    function clearToken() {
        this.token = null;
        localStorage.removeItem('token'); // 清除 localStorage 中的 token
    }
    return { token,device_id, setToken,loadToken ,clearToken}
});
