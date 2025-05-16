<script setup>
import { ref, onMounted, onBeforeUnmount, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { importImg } from '@/utils/utils'
import { useI18n } from 'vue-i18n'
import { useInviteStore } from '@/stores/invite'
import IconBtn from '@/components/public/IconBtn.vue'
const inviteStore = useInviteStore()
const router = useRouter()
const { t } = useI18n()
const imgObj = {
    coinsUrl: importImg('image/invite/coins.png'),
    adIconUrl: importImg('image/invite/ad-icon.png'),
    sucIconUrl: importImg('image/invite/success-icon.png'),
    cBImgUrl: importImg('image/invite/closebtn-ic.png')
}
const props = defineProps({
    popShow: {
        type: Boolean
    },
    data: {
        type: Object
    }
})
console.log(props);
const data = computed(() => {
    return props.data
})
// newcomer.popup.btn_ad
const btn_ad_content = computed(() => {
    return t('newcomer.popup.btn_ad')
        .replace(
            '+AD_COINS',
            `<span style="color: #FFFF75;">+${data.value.ad_conin}</span>`
        )
})

// 按钮是否能点击
const emit = defineEmits(['receiveReward', 'viewADReceive', 'closePopup'])
const isButtonDisabled = computed(() => {
    return inviteStore.isButtonDisabled
})
onMounted(() => {
})
const viewADReceive = () => {
    if (!isButtonDisabled.value) {
        inviteStore.setButtonDisabledStatus()
        emit('viewADReceive')
    }
}
const receiveReward = () => {
    if (!isButtonDisabled.value) {
        inviteStore.setButtonDisabledStatus()
        emit('receiveReward', 0)
    }
}
</script>
<template>
    <!-- 0:新人奖励未领取,1:邀请福利未领取,2:新人奖励领取,3:邀请福利已领取 -->
    <div class="popContainer">
        <van-popup :close-on-click-overlay="false" v-model:show="props.popShow" class="popup">
            <h3 v-if="data.popType == 2 || data.popType == 3">{{ $t('newcomer.popup.title_one') }}</h3>
            <h3 v-else-if="data.popType == 1">{{ $t('invite.popup_wel.title_one') }}</h3>
            <h3 v-else>{{ $t('newcomer.popup.title') }}</h3>
            <div class="coin_contain">
                <van-image width="17vw" fit="contain" lazy-load :src="imgObj.coinsUrl" />
                <span style="font-weight: bolder;">+{{ data.coin }}</span>
                <van-image v-if="data.popType == 2 || data.popType == 3" width="4.7vw" fit="contain" class="sucIcon"
                    lazy-load :src="imgObj.sucIconUrl" />
            </div>
            <div v-if="data.popType == 0" class="illustrate">
                {{ $t('newcomer.popup.content') }}
            </div>
            <div v-else-if="data.popType == 3" class="illustrate">
                {{ $t('invite.popup_wel.content') }}
            </div>
            <div v-if="data.popType == 2 || data.popType == 3" class="btn_contain">
                <div class="btn" @click="emit('closePopup')">
                    <span style="color: #FEFEFE;font-size: 4.4vw;">
                        {{ $t('newcomer.btn') }}
                    </span>
                </div>
            </div>
            <div v-else class="btn_contain">
                <div class="btn" :disable="isButtonDisabled" @click="viewADReceive">
                    <van-image width="4.6vw" fit="contain" style="margin-right: 2vw;" lazy-load
                        :src="imgObj.adIconUrl" />
                    <span style="color: #FEFEFE;font-size: 4.4vw;" v-if="data.popType == 0" v-html="btn_ad_content">
                    </span>
                    <span style="color: #FEFEFE;font-size: 4.4vw;" v-else-if="data.popType == 1"
                        v-html="btn_ad_content">
                    </span>
                </div>
                <span :disable="isButtonDisabled" style="color: #D445EE;text-decoration: underline;"
                    @click="receiveReward">
                    {{ $t('newcomer.popup.btn') }}
                </span>
            </div>
        </van-popup>
        <IconBtn v-if="props.popShow" class="icon" wid="7" hei="3.4" :img-url="imgObj.cBImgUrl"
            @click="emit('closeDirectPopup')"></IconBtn>
    </div>
</template>
<style scoped>
.popContainer {
    .van-popup {
        background: transparent;
        /* 设置为透明 */
    }

    .van-popup--center {
        top: 40vh;
    }

    .popup {
        background: linear-gradient(0deg, #FFFFFF 0%, #F8C8FF 100%);
        padding: 3.2vh 4.8vw;
        border-radius: 2vw;
        width: 83.5vw;

        >h3 {
            font-size: 5.3vw;
            color: #A017B6;
            text-align: center;
            margin-bottom: 2.3vh;
        }

        .coin_contain {
            width: 74vw;
            background-color: #FFFFFF;
            border-radius: 1.5vw;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: column;
            padding: 1.5vh 0;
            margin-bottom: 2.3vh;
            position: relative;

            >span {
                font-size: 4.2vw;
                color: #FFC127;
                font-weight: bold;
            }

            .sucIcon {
                position: absolute;
                right: 0.5vw;
                top: 0.2vh;
            }
        }

        .illustrate {
            font-size: 4.2vw;
            color: #391D3E;
            overflow: hidden;
            margin: 0 2vw;
            margin-bottom: 3.2vh;
        }

        .btn_contain {
            display: flex;
            align-items: center;
            flex-direction: column;


            .btn {
                width: 65vw;
                background: linear-gradient(0deg, #9A56FF 0%, #FF8BFC 100%);
                padding: 1.5vh 0;
                border-radius: 1.5vw;
                text-align: center;
                display: flex;
                align-items: center;
                justify-content: center;
                margin-bottom: 1.8vh;
                font-weight: bolder;
            }
        }
    }

    .icon {
        position: fixed;
        bottom: 30vh;
        left: 47vw;
        z-index: 3000;
    }
}
</style>
