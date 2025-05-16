<script setup>
import { useRouter } from 'vue-router'
import { ref, onMounted, computed, onUnmounted, inject } from 'vue'
import { useI18n } from 'vue-i18n'
import { useInviteStore } from '@/stores/invite'
import IconBtn from '@/components/public/IconBtn.vue'
import { importImg, updateCountdown, formatNumber, formatDate, formatUrl } from '@/utils/utils'
// 使用 import 引入图片,不然打包的时候识别不了
const imgObj = {
    gPUrl: importImg('image/invite/gift-package.png'),
    rImgUrl: importImg('image/invite/right-icon.png'),
    tIUrl: importImg('image/inviteRanking/time-icon.png'),
    rWUrl: importImg('image/inviteRanking/reward_wen.png'),
    crownOUrl: importImg('image/inviteRanking/crown_one.png'),
    crownTUrl: importImg('image/inviteRanking/crown_two.png'),
    crownThreeUrl: importImg('image/inviteRanking/crown_three.png'),
    peopleUrl: importImg('image/inviteRanking/people.png'),
    coinsUrl: importImg('image/exchange/coins.png'),
    defaultImgUrl: importImg('image/invite/default_img.png'),
}
const props = defineProps({
    isActive: {
        type: Boolean,
        default: false // 设置默认值
    },
    data: {
        type: Object
    }
})
const { t } = useI18n()
const emit = defineEmits(['openPopup'])
const router = useRouter()
// 获取邀请排行榜信息
const rankInfo = ref(null)
const activityTime = inject('activityTime');
const activity_header = ref(null)
const load = ref(false)
// 排名信息
const rankFirstThree = ref(null)
const defaultRankFirstThree = [
    {
        rank: 2,
        avatar: imgObj.defaultImgUrl
    },
    {
        rank: 1,
        avatar: imgObj.defaultImgUrl
    },
    {
        rank: 3,
        avatar: imgObj.defaultImgUrl
    },
]
// 定义邀请store
const inviteStore = useInviteStore()
// 倒计时文本
const countdown = ref('');
// 定时器
let interval = null;
// 更新倒计时
const update = () => {
    countdown.value = updateCountdown(rankInfo.value.rank_config.end_time);
};
// 组件挂载时启动倒计时
onMounted(async () => {
    if (props.isActive) {
        load.value = true
        // 请求邀请排行榜信息
        await inviteStore.getRankInfo()
        rankInfo.value = inviteStore.rankInfo
        rankFirstThree.value = inviteStore.rankFirstThree().length ? inviteStore.rankFirstThree() : defaultRankFirstThree
        activityTime.value = formatDate(rankInfo.value.rank_config.start_time, 1) + '~' + formatDate(rankInfo.value.rank_config.end_time, 1)
        load.value = false
        update()
        interval = setInterval(update, 1000); // 每秒更新一次
        activity_header.value = computed(() => {
            return t('invite.activity.header')
                .replace('TOTAL_COIN', `<span style="color: #FF3000;font-size: 4.8vw;">${formatNumber(rankInfo.value.coin_total)}</span>`)
        })
    }
});

// 组件卸载时清除定时器
onUnmounted(() => {
    clearInterval(interval);
});
const goInviteHistoryReward = () => {
    router.push('/invite-history-reward')
}
const goInviteRankings = () => {
    router.push('/invite-rankings')
}
// 提取邀请码的函数
function extractInviteCode(name) {
    // 使用正则表达式匹配邀请码
    const match = name.match(/Visitor-(.+)/);

    // 如果匹配成功，返回邀请码
    if (match) {
        return match[1];
    }

    // 如果匹配失败，返回空字符串
    return name;
}
</script>

<template>
    <div class="inviteActivity" v-if="!load">
        <div v-if="props.isActive && rankInfo" class="iAHeader">
            <p v-html="activity_header.value"></p>
            <div class="time-bg">
                <van-image style="margin-right: 1vw;" width="3.2vw" fit="fill" lazy-load :src="imgObj.tIUrl" />
                {{ countdown }}
                <van-image @click="emit('openPopup')" style="margin-left: 1vw;" width="4.2vw" fit="fill" lazy-load
                    :src="imgObj.rWUrl" />
            </div>
        </div>
        <div v-if="props.isActive && rankInfo" class="iAContentOne" @click="goInviteRankings">
            <div>
                <div class="rank-top-list">
                    <div :class="['rank-top-container', { 'r-table-one': item.rank === 2 }, { 'r-table-two': item.rank === 1 }, { 'r-table-three': item.rank === 3 }]"
                        v-for="item in rankFirstThree" :key="item.rank">
                        <div class="rank-medal-outer-container"
                            :style="{ '--rank_user_img': `url(${formatUrl(item.avatar)})` }">
                            <div class="rank-medal-container">
                                <van-image class="crown-img" v-if="item.rank === 2" style="top: -2.8vh;left: 3.5vw;"
                                    width="9.5vw" fit="fill" lazy-load :src="imgObj.crownTUrl" />
                                <van-image class="crown-img" v-else-if="item.rank === 1" style="top: -3vh;left: 3.5vw;"
                                    width="11vw" fit="fill" lazy-load :src="imgObj.crownOUrl" />
                                <van-image class="crown-img" v-else style="top: -2.5vh;left: 3.8vw;" width="9.5vw"
                                    fit="fill" lazy-load :src="imgObj.crownThreeUrl" />
                                <span class="rank-text">{{ item.rank }}</span>
                            </div>
                        </div>
                        <div
                            :class="['rank-container', { 'r-img-one': item.rank === 2 }, { 'r-img-two': item.rank === 1 }, { 'r-img-three': item.rank === 3 }]">
                            <span class="name" v-if="item.user_name">{{ extractInviteCode(item.user_name) }}</span>
                            <span class="invite-num" v-if="item.mentee_count">
                                <van-image width="3.7vw" fit="fill" lazy-load :src="imgObj.peopleUrl" />
                                {{ item.mentee_count }}
                            </span>
                            <span class="name wait_rank" v-else>
                                {{ $t('invite.activity.wait_rank') }}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="own-main-content">
                <div class="main-top">
                    <div class="user-info">
                        <div class="user-img"
                            :style="{ '--user_img': `url(${formatUrl(rankInfo.current_user_rank.avatar)})` }">
                        </div>
                        <div>
                            <p v-if="rankInfo.current_user_rank.rank">
                                {{ $t('invite.activity.my_rank') }}:<span>{{ rankInfo.current_user_rank.rank }}</span>
                            </p>
                            <p v-else>{{ $t('invite.activity.no_rank') }}</p>
                            <p>
                                {{ $t('invite.activity.invite_number') }}:{{ rankInfo.current_user_rank?.mentee_count }}
                            </p>
                        </div>
                    </div>
                    <div class="reward-info">
                        <span style="font-size: 3.2vw;">{{ $t('invite.activity.predict_revenue') }}</span>
                        <p>
                            <span>{{ rankInfo.current_user_rank.estimated_revenue }}</span>
                            <van-image width="6.5vw" fit="contain" lazy-load :src="imgObj.coinsUrl" />
                        </p>
                    </div>
                </div>
                <div class="main-bottom">
                    {{ $t('invite.activity.tip_content') }}
                </div>
                <IconBtn class="go-rangking" wid="1.5" hei="1.3" :img-url="imgObj.rImgUrl">
                </IconBtn>
            </div>
        </div>
        <div v-else class="iAContentTwo" @click="goInviteHistoryReward">
            <div>
                <van-image width="20vw" fit="fill" lazy-load :src="imgObj.gPUrl" />
            </div>
            <div>
                <span>
                    {{ $t('invite.no_activity.content_one') }}
                </span>
                <span>
                    {{ $t('invite.no_activity.content_two') }}
                </span>
            </div>
            <IconBtn wid="1.5" hei="1.3" :img-url="imgObj.rImgUrl">
            </IconBtn>
        </div>
    </div>
    <div class="inviteActivity" v-else>
        <LoadPage></LoadPage>
    </div>
</template>
<style scoped>
.inviteActivity {
    background-color: #ffffff;
    border: 1px solid #fff;
    border-radius: 3.5vw;
    margin-bottom: 2vh;
    position: relative;
    padding: 0.6vh 0.8vw;

    &::before {
        content: '';
        position: absolute;
        top: 0;
        /* 外部边框的厚度 */
        left: 0;
        /* 外部边框的厚度 */
        right: 0;
        /* 外部边框的厚度 */
        bottom: 0;
        /* 外部边框的厚度 */
        border: 1.5vw solid #b14fcc;
        /* 外部边框 */
        border-radius: 3.5vw;
        /* 外部圆角，设置为内部圆角的值加上外部边框的厚度 */
        pointer-events: none;
        /* 允许点击穿透 */
    }

    .iAHeader {
        height: 5vh;
        background-image: url('@/assets/image/invite/texture.png');
        background-size: 89vw 5vh;
        background-repeat: no-repeat;
        background-position: center;
        /* 背景图片居中 */
        font-size: 4.4vw;
        line-height: 4vh;
        text-align: center;
        font-weight: bold;
        font-size: 3.5vw;
        color: #A017B6;
        position: relative;

        .time-bg {
            position: absolute;
            bottom: -1.5vh;
            left: 32vw;
            color: #E1872D;
            display: flex;
            align-items: center;
            justify-content: center;

        }
    }

    .iAContentOne {
        display: flex;
        align-items: center;
        flex-direction: column;
        padding: 0 2vw 1vh;

        >div:nth-child(1) {
            position: relative;
            width: 90vw;
            height: 16vh;

            .rank-top-list {
                display: flex;
                position: absolute;
                align-items: end;
                bottom: 0.7vh;
                left: 0vw;

                .rank-top-container {
                    position: relative;
                    display: flex;
                    flex-direction: column;
                    align-items: center;

                    .rank-medal-outer-container {
                        position: absolute;
                        background:
                            url('@/assets/image/inviteRanking/rank_kuang.png') no-repeat center / 100% 100%,
                            var(--rank_user_img) no-repeat center / 90% 90%;
                        text-align: center;

                        .rank-medal-container {
                            position: relative;
                            width: 20vw;
                            height: 9.5vh;

                            .crown-img {
                                position: absolute;
                            }

                            >span {
                                font-weight: bold;
                                font-size: 4.1vw;
                                color: #FFFFFF;
                            }
                        }
                    }

                    .rank-container {
                        display: flex;
                        align-items: center;
                        flex-direction: column;
                        justify-content: flex-start;

                        .name {
                            display: inline-block;
                            width: 19.3vw;
                            font-size: 3vw;
                            text-align: center;
                            border-radius: 1vw;
                            overflow: hidden;
                            /* 超出部分隐藏 */
                            text-overflow: ellipsis;
                            white-space: nowrap;
                            /* 强制文本不换行 */
                        }

                        .invite-num {
                            display: inline-block;
                            width: 24.6vw;
                            font-size: 3.3vw;
                            color: #fff;
                            text-align: center;
                            line-height: 1.8vh;
                            border-radius: 1vw;
                        }

                        .wait_rank {
                            display: inline-block;
                            width: 24.6vw;
                            font-size: 3.1vw;
                            text-align: center;
                            line-height: 1.5vh;
                            border-radius: 1vw;
                            overflow: hidden;
                            /* 超出部分隐藏 */
                            text-overflow: ellipsis;
                            white-space: nowrap;
                            /* 强制文本不换行 */
                        }
                    }

                    .r-img-one {
                        .name {
                            background: #43658E;
                            color: #CBE2FF;
                        }

                        .invite-num {
                            background: linear-gradient(0deg, #43658E 0%, #5D86B8 100%);
                        }
                    }

                    .r-img-two {
                        .name {
                            background: #C2382E;
                            color: #FFCFCB;
                        }

                        .invite-num {
                            background: linear-gradient(0deg, #C2382E 0%, #ED5E54 100%);
                        }
                    }

                    .r-img-three {
                        .name {
                            background: #974E1A;
                            color: #FFEBCB;
                        }

                        .invite-num {
                            background: linear-gradient(0deg, #974E1A 0%, #C36A2A 100%);
                        }
                    }

                }

                .r-table-one {
                    position: absolute;
                    bottom: -0.5vh;
                    left: 5vw;

                    .rank-medal-outer-container {
                        width: 16vw;
                        height: 7.8vh;
                        top: -7.5vh;
                        left: 4vw;

                        .rank-text {
                            position: absolute;
                            top: -1.8vh;
                            left: 7vw;
                        }
                    }
                }

                .r-table-two {
                    position: absolute;
                    bottom: 0vh;
                    left: 32.5vw;
                    z-index: 10;

                    .rank-medal-outer-container {
                        width: 18vw;
                        height: 8.4vh;
                        top: -8vh;
                        left: 4vw;

                        .rank-text {
                            position: absolute;
                            top: -1.8vh;
                            left: 7.5vw;
                        }
                    }
                }

                .r-table-three {
                    position: absolute;
                    bottom: -0.7vh;
                    left: 60.5vw;

                    .rank-medal-outer-container {
                        width: 16vw;
                        height: 7.8vh;
                        top: -7.5vh;
                        left: 4vw;

                        .rank-text {
                            position: absolute;
                            top: -1.8vh;
                            left: 7vw;
                        }
                    }
                }
            }
        }


        .own-main-content {
            width: 90%;
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: space-between;
            flex-direction: column;
            padding: 0vh 4vw 0.5vh 1.5vw;
            background: #FFCC40;
            border-radius: 2.1vw;
            margin-top: 0.3vh;
            position: relative;

            .main-top {
                width: 100%;
                display: flex;
                align-items: center;
                justify-content: space-between;
                color: #9611BA;

                .user-info {
                    display: flex;
                    align-items: center;
                    justify-content: center;

                    .user-img {
                        width: 8vw;
                        height: 3.7vh;
                        background:
                            url('@/assets/image/inviteRanking/user_kuang.png') no-repeat center / 100% 100%,
                            var(--user_img) no-repeat center / 90% 90%;
                        margin-right: 2vw;
                    }

                    >div {
                        display: flex;
                        flex-direction: column;
                        font-size: 3.2vw;
                        max-width: 40vw;

                        span {
                            font-weight: bold;
                        }

                    }

                }

                .reward-info {
                    >p {
                        display: flex;
                        align-items: center;
                        flex-direction: row-reverse;

                        >span {
                            font-size: 4.1vw;
                            margin-left: 1vw;
                        }
                    }
                }
            }

            .main-bottom {
                font-size: 3.4vw;
                color: #A57900;
                position: relative;
                /* padding-left: 5vw; */

                >span {
                    display: inline-block;
                    color: #A57900;
                    border: 0.6vw solid #A57900;
                    border-radius: 50%;
                    width: 3.2vw;
                    height: 1.5vh;
                    text-align: center;
                    font-weight: bold;
                    border-radius: 50%;
                    line-height: 1.8vh;
                    font-size: 3.2vw;
                    position: absolute;
                    top: 0.2vh;
                    left: 0vw;
                }
            }

            .go-rangking {
                position: absolute;
                top: 4.5vh;
                right: 1vw;
            }

        }
    }

    .iAContentTwo {
        display: flex;
        align-items: center;
        padding: 1vh 1vw 0;

        >div {
            display: flex;
            flex-direction: column;
            margin-right: 2vw;

            >span {
                max-width: 62vw;
            }

            >span:nth-child(1) {
                font-weight: bold;
                font-size: 4vw;
                color: #A017B6;
                /* line-height: 50px; */
            }

            >span:nth-child(2) {
                font-weight: normal;
                font-size: 3.4vw;
                color: #50CA01;
            }
        }
    }
}
</style>
