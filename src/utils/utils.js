import config from '@/config'
const domain = import.meta.env.VITE_domain
export function importImg(url){
    return new URL(`../assets/${url}`, import.meta.url).href;
}

export function formatNumber(number) {
    return Number(number).toLocaleString();
}
export function formatDate(dateTime,time=0) {
    let dateString = ''
    if (dateTime){
        dateString =dateTime
    }else{
        dateString =new Date();
    }
    const date = new Date(dateString);
    const month = String(date.getMonth() + 1).padStart(2, '0'); // 获取月份并补零
    const day = String(date.getDate()).padStart(2, '0'); // 获取日期并补零
    const year = date.getFullYear(); // 获取年份
    if(time){
      // 获取时间部分
      const hours = String(date.getHours()).padStart(2, '0'); // 获取小时并补零
      const minutes = String(date.getMinutes()).padStart(2, '0'); // 获取分钟并补零
      // 格式化为 DD/MM/YYYY HH:MM
      return `${day}/${month}/${year} ${hours}:${minutes}`;
    }else{
      return `${month}/${day}/${year}`; // 格式化为 MM/DD/YYYY
    }
}

export function docuLocation(params){
    setTimeout(()=>{
        document.location = `${config.appKey}://${params}`
    },100)
}

export function selectRandomNumber (index,length) {
    let randomIndex;
    do {
        randomIndex = Math.floor(Math.random() * length);
      } while (index == randomIndex);
    return randomIndex
};

export function formattedValue(number) {
    if (number >= 1000000) {
      return `${Math.floor(number / 1000000)}M`;
    } else if (number >= 1000) {
      return `${Math.floor(number / 1000)}K`;
    } else {
      return number.toString();
    }
}

// 更新倒计时
export function updateCountdown (endTime) {
  const endDate = new Date(endTime); // 将字符串转换为 Date 对象
  const now = new Date(); // 当前时间
  const diff = endDate - now; // 计算时间差（毫秒）

  if (diff <= 0) {
    // 如果时间差小于等于 0，表示活动已结束
    countdown.value = '活动已结束';
    clearInterval(interval); // 停止倒计时
    return;
  }

  // 计算天、小时、分钟、秒
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  // 格式化倒计时
  return `${days}d ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

export function formatUrl (url) {
  // 判断 URL 是否包含 http 或 https
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url; // 如果包含，直接返回
  } else if (url.startsWith('/')) {
    return `${domain}${url}`; // 如果是相对路径，拼接域名
  } else {
    return `${domain}/${url}`; // 否则拼接域名
  }
};
// 获取当前日期
export function getCurrentDate() {
  const now = new Date();
  return now.toISOString().split('T')[0]; // 格式化为 YYYY-MM-DD
};