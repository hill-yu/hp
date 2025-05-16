<script setup>
import { inject } from 'vue'
import { importImg } from '@/utils/utils'
import IconBtn from '@/components/public/IconBtn.vue'
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
    activityTime: {
        type: String
    }
})
console.log(props);
// 按钮是否能点击
const emit = defineEmits(['closePopup'])
const activityTime = inject('activityTime', 'No activity time provided');
</script>
<template>
    <!-- 活动规则弹窗 -->
    <div class="popContainer">
        <van-popup :close-on-click-overlay="false" v-model:show="props.popShow" class="popup">
            <h3>{{ $t('invite.rule_popup.title') }}</h3>
            <div class="coin_contain">
                <div>
                    <h3>
                        {{ $t('invite.rule_popup.activity_time') }}
                    </h3>
                    <p v-if="props.activityTime" style="color: #FF0000">
                        {{ props.activityTime }}
                    </p>
                    <p v-else style="color: #FF0000">
                        {{ activityTime }}
                    </p>
                </div>
                <div>
                    <h3>
                        {{ $t('invite.rule_popup.title.content_two') }}
                    </h3>
                    <p>
                        {{ $t('invite.rule_popup.content.content_one') }}
                    </p>
                    <p>
                        {{ $t('invite.rule_popup.content.content_two') }}
                    </p>

                    <h3>
                        {{ $t('invite.rule_popup.title.content_three') }}
                    </h3>
                    <p>
                        {{ $t('invite.rule_popup.content.content_three') }}
                    </p>
                    <p>
                        {{ $t('invite.rule_popup.content.content_four') }}
                    </p>
                </div>
            </div>
        </van-popup>
        <IconBtn v-if="props.popShow" class="icon" wid="7" hei="3.4" :img-url="imgObj.cBImgUrl"
            @click="emit('closePopup')"></IconBtn>
    </div>
</template>
<style scoped>
.popContainer {

    .van-popup {
        background: transparent;
        /* 设置为透明 */
    }

    .van-popup--center {
        top: 43vh;
    }

    .popup {
        background: linear-gradient(0deg, #FFFFFF 0%, #F8C8FF 100%);
        padding: 2vh 2vw 4vh;
        border-radius: 2vw;
        width: 96vw;

        >h3 {
            font-size: 5.3vw;
            color: #A017B6;
            text-align: center;
            margin-bottom: 1vh;
        }

        .coin_contain {
            max-height: 50vh;
            background-color: #FFFFFF;
            border-radius: 1.5vw;
            padding: 1.5vh 2vw;
            word-wrap: break-word;
            overflow-y: auto;
            text-wrap: wrap;

            h3 {
                font-size: 4.4vw;
            }

            p {
                font-size: 4vw;
                color: #333333;
            }

            div {
                margin-bottom: 1.5vh;
            }
        }
    }

    .icon {
        position: fixed;
        bottom: 19vh;
        left: 47vw;
        z-index: 3000;
    }

}
</style>
