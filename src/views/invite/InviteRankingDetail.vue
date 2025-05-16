<script setup>
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { importImg, formatDate, formattedValue, formatUrl } from '@/utils/utils'
import { useInviteStore } from '@/stores/invite'
// 使用 import 引入图片,不然打包的时候识别不了
const imgObj = {
    rImgUrl: importImg('image/invite/right-icon.png'),
    peopleUrl: importImg('image/inviteRanking/people.png'),
    RCUrl: importImg('image/inviteRanking/reward_coin.png'),
    RSUrl: importImg('image/inviteRanking/reward_strength.png'),
    RBUrl: importImg('image/inviteRanking/reward_bleak.png'),
    RMOUrl: importImg('image/inviteRanking/rank-medal-one.png'),
    RMTUrl: importImg('image/inviteRanking/rank-medal-two.png'),
    RMThreeUrl: importImg('image/inviteRanking/rank-medal-three.png'),
}
// 获取来源类型
const route = useRoute()
const { t } = useI18n()
// 定义邀请store
const inviteStore = useInviteStore()
const rankDetailConfig = ref(null)
const rankDetailFirstThree = ref(null)
const rankDetailAfterThird = ref(null)
// 获取参数
const season = route.params.season;
onMounted(() => {
    rankDetailFirstThree.value = inviteStore.rankDetailFirstThree({ season: season })
    rankDetailAfterThird.value = inviteStore.rankDetailAfterThird({ season: season })
    rankDetailConfig.value = inviteStore.cur_season_config
})
const formatHistoryTitle = (season) => {
    return t('inviterank.title')
        .replace('NUMBER', season)
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

</script>

<template>
    <div class="InviteHisReward" v-if="rankDetailConfig">
        <h3>{{ formatHistoryTitle(rankDetailConfig.season) }}</h3>
        <h5>{{ $t('inviterankdetail.activity_time') }}:
            {{ formatDate(rankDetailConfig.start_time) }}~{{ formatDate(rankDetailConfig.end_time) }}
        </h5>
        <div class="ranking-list">
            <div :class="['ranking-item', { 'r-i-one': threeItem.rank === 1 }, { 'r-i-two': threeItem.rank === 2 }, { 'r-i-three': threeItem.rank === 3 }]"
                v-for="threeItem in rankDetailFirstThree" :key="threeItem.rank">
                <div class="rank-medal-img">
                    <van-image v-if="threeItem.rank == 1" width="7.5vw" fit="fill" lazy-load :src="imgObj.RMOUrl" />
                    <van-image v-else-if="threeItem.rank == 2" width="7.5vw" fit="fill" lazy-load
                        :src="imgObj.RMTUrl" />
                    <van-image v-else width="7.5vw" fit="fill" lazy-load :src="imgObj.RMThreeUrl" />
                </div>
                <div class="main-content main-special">
                    <div class="user-info">
                        <div class="user-img special" :style="{ '--user_img': `url(${formatUrl(threeItem.avatar)})` }">
                        </div>
                        <div>
                            <span>{{ threeItem.username }}</span>
                            <span class="invite-num-one">
                                <van-image width="3.7vw" fit="fill" lazy-load :src="imgObj.peopleUrl" />
                                {{ threeItem.invite_num }}
                            </span>
                        </div>
                    </div>
                    <div class="reward-img"
                        @click="onShowImagePreview(threeItem.reward_info.images, threeItem.reward_info.desc)">
                        <van-image width="16vw" height="5.8vh" fit="fill" lazy-load
                            :src="formatUrl(threeItem.reward_info.images.split(',')[0])" />
                        <span>{{ threeItem.reward_info.name }}</span>
                    </div>
                    <div class="reward-info">
                        <div>
                            <div>
                                <van-image width="9.7vw" fit="fill" lazy-load :src="imgObj.RCUrl" />
                            </div>
                            <span>+{{ formattedValue(threeItem.coin) }}</span>
                        </div>
                        <div v-if="threeItem.strength && threeItem.strength !== 0">
                            <div>
                                <van-image style="margin-top: 0.6vh;" width="8.5vw" fit="fill" lazy-load
                                    :src="imgObj.RSUrl" />
                            </div>
                            <span>+{{ threeItem.strength }}</span>
                        </div>
                        <div v-if="threeItem.lottery_ticket && threeItem.lottery_ticket !== 0">
                            <div>
                                <van-image style="margin-top: 0.7vh;" width="8.5vw" fit="fill" lazy-load
                                    :src="imgObj.RBUrl" />
                            </div>
                            <span>+{{ threeItem.lottery_ticket }}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="ranking-item" v-for="item in rankDetailAfterThird" :key="item.rank">
                <p>{{ item.rank }}</p>
                <div class="main-content">
                    <div class="user-info">
                        <div class="user-img" :style="{ '--user_img': `url(${formatUrl(item.avatar)})` }"></div>
                        <div>
                            <span style="width: 35vw;">{{ item.username }}</span>
                            <span class="invite-num-one">
                                <van-image width="3.7vw" fit="fill" lazy-load :src="imgObj.peopleUrl" />
                                {{ item.invite_num }}
                            </span>
                        </div>
                    </div>
                    <div class="reward-info">
                        <div>
                            <div>
                                <van-image width="9.7vw" fit="fill" lazy-load :src="imgObj.RCUrl" />
                            </div>
                            <span>+{{ formattedValue(item.coin) }}</span>
                        </div>
                        <div v-if="item.strength && item.strength !== 0">
                            <div>
                                <van-image style="margin-top: 0.6vh;" width="8.5vw" fit="fill" lazy-load
                                    :src="imgObj.RSUrl" />
                            </div>
                            <span>+{{ item.strength }}</span>
                        </div>
                        <div v-if="item.lottery_ticket && item.lottery_ticket !== 0">
                            <div>
                                <van-image style="margin-top: 0.7vh;" width="8.5vw" fit="fill" lazy-load
                                    :src="imgObj.RBUrl" />
                            </div>
                            <span>+{{ item.lottery_ticket }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- 图片预览，图片放大 -->
        <van-image-preview v-model:show="imgShow" :images="images" :close-on-click-image="false">
            <template #image="{ src, style, onLoad }">
                <img :src="src" :style="[{ width: '100%' }, style]" @load="onLoad" />
                <p style="color: #fff;">{{ imgDesc }}</p>
            </template>
        </van-image-preview>
    </div>
</template>
<style scoped>
.InviteHisReward {
    padding: 2vh 1.7vw 2vh;
    background: linear-gradient(0deg, #E353F9 0%, #A30DC0 100%);
    min-height: 100vh;
    color: #9611BA;
    text-align: center;

    >h3 {
        font-weight: bold;
        font-size: 4vw;
        color: #FFFEFE;
        text-shadow: -1px 1px 0px #3E0C55;
    }

    >h5 {
        font-size: 3.5vw;
        color: #FFE9CC;
        font-weight: normal;
    }

    .ranking-list {
        padding: 0.5vh 2vw;

        .ranking-item {
            background: #FFF5D8;
            border-radius: 2.6vw;
            border: 1px solid #000000;
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 0.5vh;
            position: relative;

            >p {
                width: 6vw;
                text-align: center;
                line-height: 6.6vh;
                font-weight: bolder;
                color: #9e30bb;
                font-size: 3.5vw;
            }

            .rank-medal-img {
                position: absolute;
                top: 1vh;
                left: -2vw;
            }

            .main-content {
                flex: 1;
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding-right: 2vw;

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
                        margin-right: 1vw;
                    }

                    .special {
                        background:
                            url('@/assets/image/inviteRanking/rank_kuang.png') no-repeat center / 100% 100%,
                            var(--user_img) no-repeat center / 90% 90%;
                    }

                    >div {
                        display: flex;
                        flex-direction: column;

                        >span {
                            width: 16vw;
                            font-weight: normal;
                            font-size: 4vw;
                            overflow: hidden;
                            /* 超出部分隐藏 */
                            text-overflow: ellipsis;
                            white-space: nowrap;
                            text-align: left;

                            &:nth-child(2) {
                                font-weight: normal;
                                font-size: 3.5vw;
                            }
                        }

                    }

                }

                .reward-img {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    position: relative;
                    height: 6.3vh;

                    .van-image {
                        border-radius: 1vw;
                        overflow: hidden;
                    }

                    >span {
                        max-width: 16vw;
                        position: absolute;
                        bottom: 0vh;
                        left: 0vw;
                        font-weight: normal;
                        font-size: 3vw;
                        color: #FFFFFF;
                        text-shadow: 0px 1px 0px #000000;
                        overflow: hidden;
                        /* 超出部分隐藏 */
                        text-overflow: ellipsis;
                        white-space: nowrap;
                        /* 强制文本不换行 */
                        background: #000000;
                        border-radius: 0px 0px 1vw 1vw;
                        opacity: 0.52;
                    }
                }

                .reward-info {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    /* flex-direction: column; */

                    /* >div {
                        display: flex;
                        justify-content: space-between;

                        .van-image {
                            margin-left: 2vw;
                        }

                        >span {
                            margin-left: 2vw;
                        }

                        &:nth-child(1) {
                            align-items: flex-end;
                        }

                        &:nth-child(2) {
                            line-height: 1vh
                        }
                    } */

                    >div {
                        width: 9.8vw;
                        height: 3.8vh;
                        display: flex;
                        align-items: center;
                        flex-direction: column;
                        justify-content: center;
                        margin-left: 1.5vw;

                        >div {
                            width: 9.8vw;
                            height: 3.8vh;
                        }

                        >span {
                            /* font-weight: bolder; */
                            font-size: 3.7vw;
                            line-height: 1.7vh;
                        }
                    }

                }

            }

            .main-special {
                padding-left: 6vw;
            }
        }

        .r-i-one {
            background-color: #C2382E;
            color: #fff;
        }

        .r-i-two {
            background-color: #43658E;
            color: #fff;
        }

        .r-i-three {
            background-color: #974E1A;
            color: #fff;
        }
    }
}
</style>
