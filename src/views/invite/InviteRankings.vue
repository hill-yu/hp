<script setup>
import { ref, onMounted, computed, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { importImg, formattedValue, updateCountdown, formatUrl, formatDate } from '@/utils/utils'
import { useInviteStore } from '@/stores/invite'
import RankingPrize from '@/components/inviteRanking/RankingPrize.vue';
import IpopupRule from '@/components/invite/IpopupRule.vue'
const imgObj = {
    tIUrl: importImg('image/inviteRanking/time-icon.png'),
    rWUrl: importImg('image/inviteRanking/reward_wen.png'),
    rMTUrl: importImg('image/inviteRanking/medal_two.png'),
    rMOUrl: importImg('image/inviteRanking/medal_one.png'),
    rMThreeUrl: importImg('image/inviteRanking/medal_three.png'),
    RCKUrl: importImg('image/inviteRanking/reward_coin_kuang.png'),
    RCUrl: importImg('image/inviteRanking/reward_coin.png'),
    RSKUrl: importImg('image/inviteRanking/reward_strength_kuang.png'),
    RSUrl: importImg('image/inviteRanking/reward_strength.png'),
    RBKUrl: importImg('image/inviteRanking/reward_bleak_kuang.png'),
    RBUrl: importImg('image/inviteRanking/reward_bleak.png'),
    RIUrl: importImg('image/inviteRanking/right-icon.png'),
    crownOUrl: importImg('image/inviteRanking/crown_one.png'),
    crownTUrl: importImg('image/inviteRanking/crown_two.png'),
    crownThreeUrl: importImg('image/inviteRanking/crown_three.png'),
    peopleUrl: importImg('image/inviteRanking/people.png'),
    rTUrl: importImg('image/inviteRanking/return_top.png'),
    defaultImgUrl: importImg('image/invite/default_img.png'),
}
const { t } = useI18n()
// 获取路由传递过来的数据
const router = useRouter()
// 获取邀请排行榜信息
const rankInfo = ref(null)
const rewardFirstThree = ref(null)
const rewardAfterThird = ref(null)
const rank_title = ref(null)
// 排名信息
const rankFirstThree = ref(null)
const rankAfterThird = ref(null)
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
const showButton = ref(false);
// 显示rule弹窗
const showRulePopup = ref(false)
const activityTime = ref(null)

const handleScroll = () => {
    // 计算 30vh 对应的像素值
    const threshold = window.innerHeight * 0.2;

    // 判断滚动位置，决定是否显示置顶按钮
    showButton.value = window.scrollY > threshold;
};

const scrollToTop = () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth',
    });
};
// 倒计时文本
const countdown = ref('');
// 定时器
let interval = null;
// 更新倒计时
const update = () => {
    countdown.value = updateCountdown(rankInfo.value.rank_config.end_time);
};
onMounted(async () => {
    // 监听滚动事件
    window.addEventListener('scroll', handleScroll);
    if (inviteStore.rankInfo) {
        rankInfo.value = inviteStore.rankInfo
    } else {
        // 请求邀请排行榜信息
        await inviteStore.getRankInfo({
            season: 1
        })
        rankInfo.value = inviteStore.rankInfo
    }
    rewardFirstThree.value = inviteStore.rewardFirstThree()
    rewardAfterThird.value = inviteStore.rewardAfterThird()
    rankFirstThree.value = inviteStore.rankFirstThree().length ? inviteStore.rankFirstThree() : defaultRankFirstThree
    rankAfterThird.value = inviteStore.rankAfterThird()
    activityTime.value = formatDate(rankInfo.value.rank_config.start_time, 1) + '~' + formatDate(rankInfo.value.rank_config.end_time, 1)
    rank_title.value = computed(() => {
        return t('inviterank.title')
            .replace('NUMBER', rankInfo.value.rank_config.season)
    })
    update()
    interval = setInterval(update, 1000); // 每秒更新一次
});

onUnmounted(() => {
    // 移除滚动事件监听
    window.removeEventListener('scroll', handleScroll);
    // 移除定时器
    clearInterval(interval);
});
// 返回至邀请页
const goInvite = () => {
    inviteStore.changeShowSharePopup()
    router.back()
}
const goInviteHistoryReward = () => {
    router.push('/invite-history-reward')
}
const closeRulePopup = () => {
    showRulePopup.value = false
}
const openRulePopup = () => {
    showRulePopup.value = true
}
// 图片预览，图片放大
const imgShow = ref(false)
const imgDesc = ref('')
const images = ref([])
const onShowImagePreview = (img, desc) => {
    if (img) {
        imgShow.value = true
        images.value = img.split(',').map((item, index) => {
            return formatUrl(item);
        });
        imgDesc.value = desc
    }
};
// 格式化函数
const formattedResult = (inputString) => {
    if (!inputString) return ''; // 如果输入为空，返回空字符串
    // 将字符串按逗号分割为数组
    const numbers = inputString.split(',');
    // 取第一个和最后一个元素
    const first = numbers[0];
    const last = numbers[numbers.length - 1];
    // 返回格式化结果
    return `${first}-${last}`;
};
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
    <div v-if="rankInfo" class="IRankingsContainer">
        <!-- 邀请排行榜 -->
        <div class="header">
            <div class="header-bg">
                {{ rank_title }}
            </div>
            <div class="time-bg">
                <van-image style="margin-right: 1vw;" width="3.4vw" fit="fill" lazy-load :src="imgObj.tIUrl" />
                {{ countdown }}
            </div>
        </div>
        <!-- 奖品容器 -->
        <div class="reward-container">
            <div class="reward-top">
                <van-image class="wenhao" @click="openRulePopup" width="5vw" fit="fill" lazy-load :src="imgObj.rWUrl" />
                <div class="table-top-list">
                    <div :class="['table-top-container', { 'table-one': item.rank === 2 }, { 'table-two': item.rank === 1 }, { 'table-three': item.rank === 3 }]"
                        v-for="item in rewardFirstThree" :key="item.rank">
                        <div class="medal-outer-container"
                            :style="{ '--rewaed_img': `url(${formatUrl(item.reward_in_kind.desc ? item.reward_in_kind.images.split(',')[0] : imgObj.RCUrl)})` }">
                            <div class="medal-container"
                                @click="onShowImagePreview(item.reward_in_kind.images, item.reward_in_kind.desc)">
                                <van-image v-if="item.rank === 2" class="medal-img" width="8.2vw" fit="fill" lazy-load
                                    :src="imgObj.rMTUrl" />
                                <van-image v-else-if="item.rank === 1" class="medal-img" width="8.2vw" fit="fill"
                                    lazy-load :src="imgObj.rMOUrl" />
                                <van-image v-else class="medal-img" width="8.2vw" fit="fill" lazy-load
                                    :src="imgObj.rMThreeUrl" />
                                <span class="medal-text" v-if="item.reward_in_kind.desc">
                                    {{ item.reward_in_kind.name }}
                                </span>
                                <span class="medal-text" v-else>{{ `+${formattedValue(item.coin)}` }}</span>
                            </div>
                        </div>
                        <div
                            :class="['table-container', { 'img-one': item.rank === 2 }, { 'img-two': item.rank === 1 }, { 'img-three': item.rank === 3 }]">
                            <RankingPrize v-if="item.reward_in_kind.desc"
                                :data="{ width: '10', height: '4.8', margin_top: 1.5, kuang_bg_img: imgObj.RCKUrl, reward_value: `+${formattedValue(item.coin)}`, reward_img: imgObj.RCUrl, reward_img_width: '10', text_margin_bottom: 1.3, text_font_size: 2.6 }">
                            </RankingPrize>
                            <RankingPrize v-if="item.strength && item.strength !== 0"
                                :data="{ width: '10', height: '4.8', margin_top: 1.5, kuang_bg_img: imgObj.RSKUrl, reward_value: `+${item.strength}`, reward_img: imgObj.RSUrl, reward_img_width: '9', text_margin_bottom: 0.8, text_font_size: 2.6 }">
                            </RankingPrize>
                            <RankingPrize v-if="item.lottery_ticket && item.lottery_ticket !== 0"
                                :data="{ width: '10', height: '4.8', margin_top: 1.5, kuang_bg_img: imgObj.RBKUrl, reward_value: `+${item.lottery_ticket}`, reward_img: imgObj.RBUrl, reward_img_width: '8', text_margin_bottom: 0.5, text_font_size: 2.6 }">
                            </RankingPrize>
                        </div>
                    </div>
                </div>
            </div>
            <div class="reward-bottom">
                <div class="reward-column" v-for="rewardItem in rewardAfterThird" :key="rewardItem.rank">
                    <div class="rank">
                        {{ formattedResult(rewardItem.ranking_item) }}
                    </div>
                    <div class="reward-column-prize">
                        <RankingPrize
                            :data="{ width: '13', height: '5.2', margin_top: 0.5, kuang_bg_img: imgObj.RCKUrl, reward_value: `+${formattedValue(rewardItem.coin)}`, reward_img: imgObj.RCUrl, reward_img_width: '10', text_margin_bottom: 1.3, text_font_size: 3.2 }">
                        </RankingPrize>
                        <!-- 显示力量奖励，前提是 rewardItem.strength 不为 0 且不为 null -->
                        <RankingPrize
                        v-if="rewardItem.strength && rewardItem.strength !== 0"
                        :data="{
                            width: '13',
                            height: '5.2',
                            margin_top: 0.5,
                            kuang_bg_img: imgObj.RSKUrl,
                            reward_value: `+${rewardItem.strength}`,
                            reward_img: imgObj.RSUrl,
                            reward_img_width: '9',
                            text_margin_bottom: 0.5,
                            text_font_size: 3.2
                        }"
                        ></RankingPrize>
                        <!-- 显示抽奖券奖励，前提是 rewardItem.lottery_ticket 不为 0 且不为 null -->
                        <RankingPrize
                        v-if="rewardItem.lottery_ticket && rewardItem.lottery_ticket !== 0"
                        :data="{
                            width: '13',
                            height: '5.2',
                            margin_top: 0.5,
                            kuang_bg_img: imgObj.RBKUrl,
                            reward_value: `+${rewardItem.lottery_ticket}`,
                            reward_img: imgObj.RBUrl,
                            reward_img_width: '8',
                            text_margin_bottom: 0,
                            text_font_size: 3.2
                        }"
                        ></RankingPrize>
                    </div>
                </div>
            </div>
        </div>
        <!-- 声明 -->
        <p class="statement">
            <!-- Disclaimer: This event has nothing to do with third-party platforms such as Apple Inc and Google Play. -->
            {{ $t('inviterank.statement') }}
        </p>
        <!-- 排行榜容器 -->
        <div class="rankings-container">
            <div class="r-c-title">
                <h3>{{ $t('inviterank.title.content_two') }}</h3>
                <div v-if="rankInfo.is_history_rank">
                    <span @click="goInviteHistoryReward">{{ $t('inviterank.jump.content') }}</span>
                    <van-image width="2.5vw" fit="fill" lazy-load :src="imgObj.RIUrl" />
                </div>
            </div>
            <div class="rankings-top">
                <div class="rank-top-list">
                    <div :class="['rank-top-container', { 'r-table-one': rankItem.rank === 2 }, { 'r-table-two': rankItem.rank === 1 }, { 'r-table-three': rankItem.rank === 3 }]"
                        v-for="rankItem in rankFirstThree" :key="rankItem.rank">
                        <!-- <div class="rank-medal-outer-container" style="width: 16vw;height: 8vh; top: -7.5vh;left: 8vw;"> -->
                        <div class="rank-medal-outer-container"
                            :style="{ '--rank_user_img': `url(${formatUrl(rankItem.avatar)})` }">
                            <div class="rank-medal-container">
                                <van-image class="crown-img" v-if="rankItem.rank === 2" style="top: -2.8vh;left: 3.5vw;"
                                    width="9.5vw" fit="fill" lazy-load :src="imgObj.crownTUrl" />
                                <van-image class="crown-img" v-else-if="rankItem.rank === 1"
                                    style="top: -3vh;left: 3.5vw;" width="11vw" fit="fill" lazy-load
                                    :src="imgObj.crownOUrl" />
                                <van-image class="crown-img" v-else style="top: -2.5vh;left: 3.8vw;" width="9.5vw"
                                    fit="fill" lazy-load :src="imgObj.crownThreeUrl" />
                            </div>
                        </div>
                        <div
                            :class="['rank-container', { 'r-img-one': rankItem.rank === 2 }, { 'r-img-two': rankItem.rank === 1 }, { 'r-img-three': rankItem.rank === 3 }]">
                            <span class="name" v-if="rankItem.user_name">
                                {{ extractInviteCode(rankItem.user_name) }}
                            </span>
                            <span class="invite-num" v-if="rankItem.mentee_count">
                                <van-image width="3.7vw" fit="fill" lazy-load :src="imgObj.peopleUrl" />
                                {{ rankItem.mentee_count }}
                            </span>
                            <span class="name wait_rank" v-else>
                                {{ $t('invite.activity.wait_rank') }}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="rankings-bottom">
                <div class="head">
                    <span style="flex: 1.2;">{{ $t('inviterank.rank.head_one') }}</span>
                    <span style="flex: 1.8;">{{ $t('inviterank.rank.head_two') }}</span>
                    <span style="flex: 1;">{{ $t('inviterank.rank.head_three') }}</span>
                </div>
                <div class="rankings-list">
                    <div class="item-container" v-for="rankItem in rankAfterThird" :key="rankItem.rank">
                        <p>{{ rankItem.rank }}</p>
                        <div class="main-content">
                            <div class="user-info">
                                <div class="user-img" :style="{ '--user_img': `url(${formatUrl(rankItem.avatar)})` }">
                                </div>
                                <span>{{ rankItem.user_name }}</span>
                            </div>
                            <span>{{ rankItem.mentee_count }}</span>
                        </div>

                    </div>
                </div>
            </div>
        </div>
        <!-- 用户信息容器，固定在底部 -->
        <div class="own-invite-info">
            <div class="info-container">
                <p v-if="rankInfo.current_user_rank.rank">{{ rankInfo.current_user_rank.rank }}</p>
                <p v-else>100+</p>
                <div class="own-main-content">
                    <div class="main-top">
                        <div class="user-info">
                            <div class="user-img"
                                :style="{ '--user_img': `url(${formatUrl(rankInfo.current_user_rank.avatar)})` }">
                            </div>
                            <div>
                                <span>{{ rankInfo.current_user_rank.nickname }}</span>
                                <span>{{ rankInfo.current_user_rank.mentee_count }} {{ $t('inviterank.rank.head_three')
                                    }}</span>
                            </div>
                        </div>
                        <span @click="goInvite">{{ $t('inviterank.jump.content_two') }}</span>
                    </div>
                    <div class="main-bottom">
                        {{ $t('invite.activity.tip_content') }}
                    </div>
                </div>
            </div>
        </div>
        <!-- 返回顶部容器 -->
        <div class="return-top-container" v-show="showButton" @click="scrollToTop">
            <van-image width="13vw" fit="fill" lazy-load :src="imgObj.rTUrl" />
        </div>
        <!-- 图片预览，图片放大 -->
        <van-image-preview v-model:show="imgShow" :images="images" :close-on-click-image="false">
            <template #image="{ src, style, onLoad }">
                <img :src="src" :style="[{ width: '100%' }, style]" @load="onLoad" />
                <p style="color: #fff;">{{ imgDesc }}</p>
            </template>
        </van-image-preview>
        <!-- 弹窗规则 -->
        <IpopupRule v-if="showRulePopup" :activityTime="activityTime" :popShow=showRulePopup
            @closePopup="closeRulePopup">
        </IpopupRule>
    </div>
    <LoadPage style="min-height: 100vh" v-else></LoadPage>
</template>
<style scoped>
.IRankingsContainer {
    min-height: 100vh;
    background: linear-gradient(0deg, #E353F9 0%, #A30DC0 100%);
    padding: 0 3vw;
    padding-top: 2vh;

    .header {
        text-align: center;
        position: relative;
        margin-bottom: 2vh;

        .header-bg {
            position: relative;
            width: 94vw;
            height: 7vh;
            line-height: 5.5vh;
            background-image: url('@/assets/image/inviteRanking/header_bg.png');
            background-size: 100% 100%;
            font-weight: bolder;
            font-size: 4vw;
            color: #FFFEFE;
            text-shadow: -1px 1px 0px #3E0C55;
            z-index: 1;
        }

        .time-bg {
            position: absolute;
            width: 35vw;
            height: 5vh;
            line-height: 5.5vh;
            background-image: url('@/assets/image/inviteRanking/time_bg.png');
            background-size: 100% 100%;
            bottom: -1.4vh;
            right: 28vw;
            font-weight: bolder;
            font-size: 3.5vw;
            color: #FFE9CC;
            text-shadow: 0px 1px 0px #823219;
            display: flex;
            align-items: center;
            justify-content: center;
        }
    }

    .reward-container {
        .reward-top {
            display: flex;
            position: relative;
            width: 94vw;
            height: 20vh;
            background-image: url('@/assets/image/inviteRanking/reward_bg.png');
            background-size: 100% 100%;

            .wenhao {
                position: absolute;
                top: -0.5vh;
                right: -1vw;
            }

            .table-top-list {
                display: flex;
                position: absolute;
                align-items: end;
                bottom: 0.7vh;
                left: -1.5vw;

                .table-top-container {
                    position: relative;
                    display: flex;
                    flex-direction: column;
                    align-items: center;

                    .medal-outer-container {
                        position: absolute;
                        width: 20vw;
                        height: 9.5vh;
                        top: -8vh;
                        left: 6.5vw;
                        background:
                            url('@/assets/image/inviteRanking/reward_kuang.png') no-repeat center / 100% 100%,
                            var(--rewaed_img) no-repeat center / 90% 90%;
                        text-align: center;

                        .medal-container {
                            position: relative;
                            top: 0vh;
                            left: 0vw;
                            width: 20vw;
                            height: 9.5vh;

                            .medal-img {
                                position: absolute;
                                top: -1.2vh;
                                left: -3vw;
                            }

                            .medal-text {
                                width: 18vw;
                                position: absolute;
                                bottom: 0vh;
                                left: 1vw;
                                font-weight: bolder;
                                font-size: 3.4vw;
                                color: #FFFFF1;
                                text-shadow: 0px 2px 0px #000000;
                                text-align: center;
                                overflow: hidden;
                                /* 超出部分隐藏 */
                                text-overflow: ellipsis;
                                white-space: nowrap;
                                /* 强制文本不换行 */
                            }
                        }
                    }



                    .table-container {
                        display: flex;
                        align-items: center;
                        justify-content: space-around;

                    }

                    .img-one {
                        width: 32vw;
                        height: 9vh;
                        background: url('@/assets/image/inviteRanking/reward-green-tabletop.png') no-repeat center / 100% 100%;
                    }

                    .img-two {
                        width: 33.5vw;
                        height: 10vh;
                        background: url('@/assets/image/inviteRanking/reward-red-tabletop.png') no-repeat center / 100% 100%;
                    }

                    .img-three {
                        width: 32vw;
                        height: 8.5vh;
                        background: url('@/assets/image/inviteRanking/reward-three-tabletop.png') no-repeat center / 100% 100%;
                    }
                }

                .table-three {
                    position: absolute;
                    bottom: 0;
                    right: -31.3vw;

                }
            }

        }

        .reward-bottom {

            .reward-column {
                display: flex;
                align-items: center;
                justify-content: space-around;
                background: #FFF5D8;
                border-radius: 2.6vw;
                border: 1px solid #000000;
                padding: 0.8vh 0;
                margin-top: 0.5vh;

                .rank {
                    width: 17vw;
                    height: 5.4vh;
                    font-weight: bolder;
                    font-size: 4.6vw;
                    color: #FFFEFF;
                    text-align: center;
                    line-height: 5.4vh;
                    background: linear-gradient(0deg, #8180A2 0%, #ACADCB 100%);
                    border-radius: 1vw;
                }

                .reward-column-prize {
                    display: flex;
                    align-items: center;
                    justify-content: space-evenly;
                    flex: 0.7;
                }
            }
        }
    }

    .statement {
        margin-top: 0.5vh;
        font-size: 3.4vw;
        color: #F19FFF;
    }

    .rankings-container {
        .r-c-title {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin: 0.5vh 0 1vh;

            >h3 {
                font-weight: bolder;
                font-size: 4.1vw;
                color: #FFFEFE;
                position: relative;
                padding-left: 2.5vw;

                &::before {
                    content: '';
                    display: inline-block;
                    width: 1vw;
                    height: 1.4vh;
                    background: #F2AEFF;
                    border-radius: 1px;
                    border: 1px solid #000000;
                    position: absolute;
                    top: 0.4vh;
                    left: 0vw;
                }
            }

            >div {
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 3.4vw;
                color: #FFFEFE;

                >span {
                    margin-right: 1vw;
                }
            }
        }

        .rankings-top {
            display: flex;
            position: relative;
            width: 94vw;
            height: 20vh;
            background-image: url('@/assets/image/inviteRanking/reward_bg.png');
            background-size: 100% 100%;

            .rank-top-list {
                display: flex;
                position: absolute;
                align-items: end;
                bottom: 0.7vh;
                left: -3vw;

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
                            top: 0vh;
                            left: 0vw;
                            width: 20vw;
                            height: 9.5vh;

                            .crown-img {
                                position: absolute;

                            }

                            .medal-text {
                                position: absolute;
                                bottom: 0vh;
                                left: 1vw;
                                font-weight: bolder;
                                font-size: 3.4vw;
                                color: #FFFFF1;
                                text-shadow: 0px 2px 0px #000000;
                                text-align: center;
                            }
                        }
                    }

                    .rank-container {
                        display: flex;
                        align-items: center;
                        flex-direction: column;
                        justify-content: flex-start;


                        .name {
                            width: 22vw;
                            font-size: 3vw;
                            text-align: center;
                            overflow: hidden;
                            /* 超出部分隐藏 */
                            text-overflow: ellipsis;
                            white-space: nowrap;
                            /* 强制文本不换行 */
                        }

                        .invite-num {
                            display: inline-block;
                            font-size: 3.3vw;
                            color: #fff;
                            text-align: center;
                            line-height: 1.5vh;
                        }

                        .wait_rank {
                            display: inline-block;
                            width: 21vw;
                            font-size: 3vw;
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
                        width: 32.5vw;
                        height: 8.2vh;
                        background: url('@/assets/image/inviteRanking/invite-medal-two.png') no-repeat center / 100% 100%;

                        .name {
                            color: #CBE2FF;
                        }
                    }

                    .r-img-two {
                        width: 35.4vw;
                        height: 9vh;
                        background: url('@/assets/image/inviteRanking/invite-medal-one.png') no-repeat center / 100% 100%;

                        .name {
                            color: #FFCFCB;
                        }
                    }

                    .r-img-three {
                        width: 32.5vw;
                        height: 7.8vh;
                        background: url('@/assets/image/inviteRanking/invite-medal-three.png') no-repeat center / 100% 100%;

                        .name {
                            color: #FFEBCB;
                        }
                    }

                }

                .r-table-one {
                    position: absolute;
                    bottom: -0.5vh;
                    left: 3.5vw;

                    .rank-medal-outer-container {
                        width: 16vw;
                        height: 8vh;
                        top: -7.5vh;
                        left: 8vw;

                    }
                }

                .r-table-two {
                    position: absolute;
                    bottom: 0vh;
                    left: 32.5vw;
                    z-index: 10;

                    .rank-medal-outer-container {
                        width: 18vw;
                        height: 9vh;
                        top: -8.5vh;
                        left: 8vw;
                    }
                }

                .r-table-three {
                    position: absolute;
                    bottom: -0.7vh;
                    left: 64.5vw;

                    .rank-medal-outer-container {
                        width: 16vw;
                        height: 7.5vh;
                        top: -7vh;
                        left: 8vw;
                    }
                }
            }
        }

        .rankings-bottom {
            .head {
                display: flex;
                align-items: center;
                justify-content: space-between;

                >span {
                    font-size: 3.4vw;
                    color: #FFFFF1;
                }
            }

            .rankings-list {
                padding-bottom: 12vh;

                .item-container {
                    height: 6vh;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    background: #FFF5D8;
                    border-radius: 2.6vw;
                    border: 1px solid #000000;
                    overflow: hidden;
                    margin-bottom: 0.3vh;

                    >p {
                        width: 11vw;
                        background: #EECDF7;
                        text-align: center;
                        line-height: 6vh;
                        font-weight: bolder;
                        font-size: 5vw;
                        color: #9e30bb;
                    }

                    .main-content {
                        flex: 1;
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        padding: 0 3vw;

                        >span {
                            width: 28.6vw;
                            border-radius: 1.3vw;
                            text-align: center;
                            line-height: 4.1vh;
                            font-weight: bold;
                            font-size: 3.5vw;
                            color: #FFFFF1;
                            background: #B53CD5;
                        }

                        .user-info {
                            display: flex;
                            align-items: center;
                            justify-content: center;

                            .user-img {
                                width: 12.2vw;
                                height: 5.6vh;
                                background:
                                    url('@/assets/image/inviteRanking/user_kuang.png') no-repeat center / 100% 100%,
                                    var(--user_img) no-repeat center / 90% 90%;
                                margin-right: 2vw;
                            }

                            >span {
                                max-width: 29vw;
                                font-weight: bold;
                                font-size: 4vw;
                                color: #9611BA;
                                overflow: hidden;
                                /* 超出部分隐藏 */
                                text-overflow: ellipsis;
                            }

                        }
                    }
                }
            }
        }
    }

    .own-invite-info {
        background: #5715EB;
        position: fixed;
        bottom: 0vh;
        left: 0vw;
        padding: 0.5vh 2vw;
        z-index: 11;

        .info-container {
            width: 95.8vw;
            height: 10vh;
            background: #FFCC40;
            border-radius: 2.6vw;
            border: 1px solid #000000;
            display: flex;
            align-items: center;
            justify-content: space-between;
            overflow: hidden;

            >p {
                width: 12vw;
                background: #FFE9AD;
                text-align: center;
                line-height: 10vh;
                font-weight: bolder;
                font-size: 5vw;
                color: #a57900;
            }

            .own-main-content {
                flex: 1;
                display: flex;
                align-items: center;
                justify-content: space-between;
                flex-direction: column;
                padding: 0 3vw;

                .main-top {
                    width: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;

                    >span {
                        width: 28.6vw;
                        border-radius: 1.3vw;
                        text-align: center;
                        line-height: 4.1vh;
                        font-weight: bold;
                        font-size: 3.5vw;
                        color: #FFFFF1;
                        background: linear-gradient(0deg, #48B500 0%, #54D301 100%);
                    }

                    .user-info {
                        display: flex;
                        align-items: center;
                        justify-content: center;

                        .user-img {
                            width: 12.2vw;
                            height: 5.6vh;
                            background:
                                url('@/assets/image/inviteRanking/user_kuang.png') no-repeat center / 100% 100%,
                                var(--user_img) no-repeat center / 90% 90%;
                            margin-right: 2vw;
                        }

                        >div {
                            display: flex;
                            flex-direction: column;

                            >span {
                                max-width: 29vw;
                                font-weight: bold;
                                font-size: 4vw;
                                color: #9611BA;
                                overflow: hidden;
                                /* 超出部分隐藏 */
                                text-overflow: ellipsis;

                                &:nth-child(2) {
                                    font-weight: normal;
                                    font-size: 3.5vw;
                                    color: #FFFFF1;
                                }
                            }

                        }

                    }
                }

                .main-bottom {
                    font-size: 3.4vw;
                    color: #A57900;
                    position: relative;
                    /* padding-left: 6.5vw; */

                    >span {
                        display: inline-block;
                        color: #A57900;
                        border: 0.6vw solid #A57900;
                        border-radius: 50%;
                        font-size: 12px;
                        width: 3.3vw;
                        height: 1.6vh;
                        text-align: center;
                        font-weight: bold;
                        border-radius: 50%;
                        line-height: 1.8vh;
                        position: absolute;
                        top: 0.2vh;
                        left: 1.5vw;
                    }
                }

            }
        }
    }

    .return-top-container {
        position: fixed;
        bottom: 30vh;
        right: 2vw;
    }

    .image-info {
        position: fixed;
        bottom: 10vh;
        right: 50vw;
        z-index: 3000;
        color: #fff;
    }
}
</style>
