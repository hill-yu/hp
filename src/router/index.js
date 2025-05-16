import { createRouter, createWebHistory } from 'vue-router'
import { showToast,showFailToast } from 'vant';
import { useTokenStore } from '@/stores/tokenStore';
import { useLangStore } from '@/stores/lang';
import NotFount from '@/views/404.vue'
// import Test from '@/views/Test.vue';
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'index',
      component: ()=>import('@/views/Index.vue')
    },
    {
      path:'/clause/:name',
      name:'clause',
      component:()=>import('@/views/Clause.vue')
    },
    {
      path:'/invite',
      name:'invite',
      component:()=>import('@/views/invite/Invite.vue')
    },
    {
      path:'/inviteDetail',
      name:'invitedetail',
      component:()=>import('@/views/invite/InviteDetail.vue')
    },
    {
      path:'/invite-rankings',
      name:'inviterankings',
      component:()=>import('@/views/invite/InviteRankings.vue')
    },
    {
      path:'/invite-history-reward',
      name:'invitehistoryreward',
      component:()=>import('@/views/invite/InviteHistoryReward.vue')
    },
    {
      path:'/invite-ranking-detail/:season',
      name:'inviterankingdetail',
      component:()=>import('@/views/invite/InviteRankingDetail.vue')
    },
    {
      path:'/invite-link',
      name:'inviteLink',
      component:()=>import('@/views/invite/InviteLink.vue')
    },
    {
      path:'/newcomerReward',
      name:'newcomerReward',
      component:()=>import('@/views/invite/NewcomerReward.vue')
    },
    {
      path:'/exchange',
      name:'exchange',
      component:()=>import('@/views/Exchange/Exchange.vue')
    },
    {
      path:'/exchangeDetail',
      name:'exchangeDetail',
      component:()=>import('@/views/Exchange/ExcDetail.vue')
    },
    {
      path:'/exchangeRecord',
      name:'exchangeRecord',
      component:()=>import('@/views/Exchange/ExcRecord.vue')
    },
    // {
    //   path:'/test',
    //   name:'test',
    //   component:Test
    // },
    {
      path: '/:pathMatch(.*)*',
      name:'404',
      component:NotFount
    }
  ],
  scrollBehavior(to, from, savedPosition) {
    // Check if the route has a hash (anchor)
    if (to.hash) {
      return {
        el: to.hash,
        behavior: 'smooth' // Optional: 'auto' or 'smooth'
      };
    }
    // Default to the top of the page
    return savedPosition || { top: 0 };
  }
})
router.beforeEach((to, from, next) => {
  if(['invite', 'exchange', 'newcomerReward'].includes(to.name) && from.name===undefined){
    const usetokenStore = useTokenStore()
    const langStore = useLangStore()
    // 全局守卫，处理所有路由
    // const token = to.query.token?to.query.token:default_token;
    // const language = to.query.language?to.query.language:default_lang;
    // const device_id = to.query.device_id?to.query.device_id:default_device_id;

    const language = to.query.language
    const device_id = to.query.device_id
    const version = to.query.version
    const token = to.query.token;
    if (token && language && device_id){
      usetokenStore.setToken(token, device_id)
      langStore.changeLang(language,version)
      next();
    } else {
      showFailToast({
        message: "url fail"
      });
    }
  }else if(to.path=='/invites'){

    const langStore = useLangStore()

    const language = to.query.language
    const user_code = to.query.user_code;
    const txt = to.query.txt;
    if (user_code && language ){
      langStore.changeLang(language)
      next({ name: 'inviteLink', query: { 
        user_code:user_code,
        txt:txt
      }});
    } else {
      showFailToast({
        message: "invites url fail"
      });
    }
  }else {
    // 打印当前请求的路由信息
    console.log(to)
    console.log('From:', from);
    next();
  }
});
export default router
