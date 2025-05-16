<script setup>
import { onMounted, computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import IconBtn from '@/components/public/IconBtn.vue'
import { importImg, formatDate, formatUrl } from '@/utils/utils'
import { useInviteStore } from '@/stores/invite'
import { post_invite_approve } from '@/api/invite'
// 使用 import 引入图片,不然打包的时候识别不了
const imgObj = {
    rImgUrl: importImg('image/invite/right-icon.png'),
    lUrl: importImg('image/inviteRanking/like.png'),
    nLUrl: importImg('image/inviteRanking/not_like.png'),
    emptyStateUrl: importImg('image/exchange/emptyState.png')
}
const { t } = useI18n()
const router = useRouter()
// 定义邀请store
const inviteStore = useInviteStore()
// 获取往期邀请排行榜
const rankHistory = ref(null)
const rankReceiveFeedback = ref(null)
onMounted(async () => {
    await inviteStore.getRankHistory()
    await inviteStore.getRankReceiveFeedback()
    rankHistory.value = inviteStore.rankHistory
    rankReceiveFeedback.value = inviteStore.rankReceiveFeedback
})
const is_like = ref(false)
const goRankingDetail = (season) => {
    router.push({
        name: 'inviterankingdetail',
        params: {
            season
        },
    })
}
const likeClick = async (id) => {
    await post_invite_approve({
        award_id: id
    }).then((result) => {
        inviteStore.changeRankReceiveFeedback(id)
    })
}
const formatHistoryTitle = (season) => {
    return t('inviterank.title')
        .replace('NUMBER', season)
}
// 图片预览，图片放大
const imgShow = ref(false)
const imgDesc = ref('')
const images = ref([])
const onShowImagePreview = (imgs, desc) => {
    if (imgs.length) {
        imgShow.value = true
        images.value = imgs.map((item, index) => {
            return formatUrl(item);
        });
        imgDesc.value = desc
    }
};

</script>

<template>
    <div class="InviteHisReward">
        <div class="history-list-container">
            <h3>{{ $t('invitehistoryreward.title.content_one') }}</h3>
            <div class="history-list" v-if="rankHistory">
                <div class="history-item" v-for="item in rankHistory" :key="item.season"
                    @click="goRankingDetail(item.season)">
                    <div class="history-info">
                        <h3>{{ formatHistoryTitle(item.season) }}</h3>
                        <p>{{ formatDate(item.start_time) }}~{{ formatDate(item.end_time) }}</p>
                    </div>
                    <IconBtn wid="1.5" hei="1.3" :img-url="imgObj.rImgUrl">
                    </IconBtn>
                </div>
                <!-- <div class="history-item">
                    <div class="history-info">
                        <h3>Pagraranggo ng Imbitasyon-Isyu 1</h3>
                        <p>01/11/2024~30/11/2024</p>
                    </div>
                    <IconBtn wid="1.5" hei="1.3" :img-url="imgObj.rImgUrl">
                    </IconBtn>
                </div>
                <div class="history-item">
                    <div class="history-info">
                        <h3>Pagraranggo ng Imbitasyon-Isyu 1</h3>
                        <p>01/11/2024~30/11/2024</p>
                    </div>
                    <IconBtn wid="1.5" hei="1.3" :img-url="imgObj.rImgUrl">
                    </IconBtn>
                </div> -->
            </div>
            <div class="history-list" v-else>
                {{ $t('invitehistoryreward.no_data') }}
            </div>
        </div>
        <div class="award-container">
            <h3>{{ $t('invitehistoryreward.title.content_two') }}</h3>
            <div class="award-list" v-if="rankReceiveFeedback?.length">
                <div class="award-item" v-for="item in rankReceiveFeedback">
                    <div class="item-top">
                        <div class="top-left">
                            <div class="user-img" :style="{ '--user_img': `url(${formatUrl(item.avatar)})` }"></div>
                            <span>{{ item.username }}</span>
                        </div>
                        <div class="top-right">
                            <van-image v-if="item.is_approve" style="margin-right: 1vw;" width="6.6vw" fit="fill"
                                lazy-load :src="imgObj.lUrl" />
                            <van-image v-else @click="likeClick(item.award_id)" style="margin-right: 1vw;" width="6.6vw"
                                fit="fill" lazy-load :src="imgObj.nLUrl" />
                            <span :style="{ color: is_like ? '#52CD00' : '#786852' }">{{ item.approve_count }}</span>
                        </div>
                    </div>
                    <div class="item-bottom">
                        <van-image v-for="imgItem in item.images" style="margin-right: 1vw;" width="20vw" fit="fill"
                            lazy-load :src="formatUrl(imgItem)" @click="onShowImagePreview(item.images, '')" />
                    </div>
                </div>
                <!-- <div class="award-item">
                    <div class="item-top">
                        <div class="top-left">
                            <div class="user-img"></div>
                            <span>Gnkahfo</span>
                        </div>
                        <div class="top-right">
                            <van-image v-if="!is_like" style="margin-right: 1vw;" width="6.6vw" fit="fill" lazy-load
                                :src="imgObj.lUrl" />
                            <van-image v-else style="margin-right: 1vw;" width="6.6vw" fit="fill" lazy-load
                                :src="imgObj.nLUrl" />
                            <span :style="{ color: !is_like ? '#52CD00' : '#786852' }">10</span>
                        </div>
                    </div>
                    <div class="item-bottom">
                        <van-image style="margin-right: 1vw;" width="20vw" fit="fill" lazy-load
                            :src="imgObj.test3Url" />
                        <van-image style="margin-right: 1vw;" width="20vw" fit="fill" lazy-load
                            :src="imgObj.test3Url" />
                        <van-image style="margin-right: 1vw;" width="20vw" fit="fill" lazy-load
                            :src="imgObj.test3Url" />
                    </div>
                </div> -->
            </div>
            <div class="award-list empty" v-else>
                <van-image width="55vw" height="18vh" lazy-load :src="imgObj.emptyStateUrl" />
                {{ $t('invitehistoryreward.no_data') }}
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
    padding: 2vh 3.7vw 2vh;
    background: linear-gradient(0deg, #E353F9 0%, #A30DC0 100%);
    min-height: 100vh;
    color: #9611BA;

    .history-list-container {
        margin-bottom: 2vh;

        >h3 {
            font-weight: bolder;
            font-size: 4.1vw;
            color: #FFFEFE;
            position: relative;
            padding-left: 2.5vw;
            margin-bottom: 1vh;

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

        .history-list {
            padding: 0 2.5vw;
            background: #FFF5D8;
            border-radius: 2.5vw;
            border: 1px solid #000000;

            .history-item {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 1vh 0;
                border-top: 1px solid #E7DEC4;

                &:nth-child(1) {
                    margin-top: 0;
                    border: 0;
                }

                .history-info {
                    >h3 {
                        font-weight: bold;
                        font-size: 4vw;
                    }

                    >p {
                        font-size: 3.5vw;
                        color: #A979B6;
                    }
                }
            }
        }
    }

    .award-container {
        >h3 {
            font-weight: bolder;
            font-size: 4.1vw;
            color: #FFFEFE;
            position: relative;
            padding-left: 2.5vw;
            margin-bottom: 1vh;

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

        .award-list {
            padding: 0 2.5vw;
            background: #FFF5D8;
            border-radius: 2.5vw;
            border: 1px solid #000000;


            .award-item {
                padding: 1vh 0;
                display: flex;
                align-items: center;
                flex-direction: column;
                border-top: 1px solid #E7DEC4;

                &:nth-child(1) {
                    margin-top: 0;
                    border: 0;
                }

                .item-top {
                    width: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    margin-bottom: 1vh;

                    .top-left {
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        font-weight: bold;

                        .user-img {
                            width: 10.5vw;
                            height: 4.8vh;
                            background:
                                url('@/assets/image/inviteRanking/user_kuang.png') no-repeat center / 100% 100%,
                                var(--user_img) no-repeat center / 90% 90%;
                            margin-right: 2vw;
                        }
                    }

                    .top-right {
                        display: flex;
                        align-items: center;
                    }
                }

                .item-bottom {
                    width: 100%;
                    display: flex;
                }
            }
        }

        .empty {
            min-height: 35vh;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            font-size: 4.2vw;
            color: #999999;
        }
    }
}
</style>
