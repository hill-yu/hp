<script setup>
const props = defineProps({
    data: {
        type: Object
    }
})
// console.log('props', props.data);

const backgroundStyle = {
    '--background-image': `url(${props.data.kuang_bg_img})`,
    '--width': `${props.data.width}vw`,
    '--height': `${props.data.height}vh`,
    '--marginTop': `${props.data.margin_top}vh`,
}
</script>

<template>
    <div class="ranking-prize" :style="backgroundStyle">
        <!-- 活动弹窗引用不需要传reward_img -->
        <van-image v-if="props.data.reward_img" :width="props.data.reward_img_width + 'vw'" fit="fill" lazy-load
            :src="props.data.reward_img" />
        <span class="reward-value"
            :style="{ marginBottom: props.data.text_margin_bottom + 'vh', fontSize: props.data.text_font_size + 'vw' }">
            {{ props.data.reward_value }}
        </span>
    </div>
</template>
<style scoped>
.ranking-prize {
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;
    width: var(--width);
    height: var(--height);
    background: var(--background-image) no-repeat center / 100% 100%;
    text-align: center;
    margin-top: var(--marginTop);

    .reward-value {
        font-weight: normal;
        color: #FFFFFF;
    }
}
</style>
