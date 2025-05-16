<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import IconBtn from '../public/IconBtn.vue'
import { importImg } from '@/utils/utils'
const { t } = useI18n()
const props = defineProps({
  options: {
    type: Object
  }
})
const task_status = [
  {
    color: '#FFA909',
    imgUrl: importImg('image/inviteDetail/tobeisused-icon.png'),
    stateText: t('invite.detail.status_two'),
    imgUrl: importImg('image/inviteDetail/tobeisused-icon.png')
  },
  {
    color: '#52C801',
    imgUrl: importImg('image/inviteDetail/Isused-icon.png'),
    stateText: t('invite.detail.status_one'),
    imgUrl: importImg('image/inviteDetail/Isused-icon.png')
  },
  {
    color: '#838C97',
    imgUrl: importImg('image/inviteDetail/becameinvalid-icon.png'),
    stateText: t('invite.detail.status_three'),
    imgUrl: importImg('image/inviteDetail/becameinvalid-icon.png')
  }
]
const task_type_content = [
  {
    content: t('invite.detail.content_one')
  },
  {
    content: t('invite.detail.content_two')
  },
  {
    content: t('invite.detail.content_three')
  }
]

const dynamicColor = computed(() => {
  return {
    '--gold-color': `${task_status[props.options.task_status]['color']}`,
    '--state-background': `${task_status[props.options.task_status]['color']}`
  }
})
</script>
<template>
  <div class="cItem" :style="props.options.task_type === 3 ? { margin: 0 } : {}">
    <div class="label">
      <p>{{ $t('invite.detail.gift_package') }} {{ props.options.task_type }}</p>
      <div class="gold">
        <p :style="dynamicColor">{{ props.options.task_value }}</p>
        <IconBtn
          wid="2.9"
          hei="1.6"
          :img-url="task_status[props.options.task_status]['imgUrl']"
        ></IconBtn>
      </div>
    </div>
    <span class="state" :style="dynamicColor">{{
      task_status[props.options.task_status]['stateText']
    }}</span>
    <p
      class="content"
      :style="props.options.task_type === 3 ? { border: 0, 'padding-bottom': '0.5vh' } : {}"
    >
      {{ task_type_content[props.options.task_type - 1]['content'] }}
    </p>
  </div>
</template>

<style scoped>
.cItem {
  margin-bottom: 1vh;
  .label {
    display: flex;
    justify-content: space-between;
    font-size: 4vw;
    font-weight: bold;
    margin-bottom: 0.8vh;
    > p {
      color: #a017b6;
    }
    .gold {
      display: flex;
      align-items: center;
      > p {
        margin-right: 2vw;
        color: var(--gold-color);
      }
    }
  }
  .state {
    color: #fdf4ff;
    background-color: var(--state-background);
    font-size: 3.4vw;
    position: relative;
    margin-left: 3vw;
    padding: 0 1vw;
    line-height: 2.2vh;
    border-radius: 3px;
    &::after {
      content: '';
      position: absolute;
      width: 0;
      height: 0;
      border-bottom: 1.2vh solid transparent;
      border-top: 1.1vh solid transparent;
      border-right: 3.1vw solid var(--state-background);
      border-radius: 3px;
      top: 0vh;
      left: -3vw;
      z-index: 10;
    }
    &::before {
      content: '';
      width: 1vw;
      height: 0.5vh;
      border-radius: 50%;
      background-color: #fff;
      position: absolute;
      top: 0.75vh;
      left: -1.2vw;
      z-index: 20;
    }
  }
  .content {
    font-size: 3.4vw;
    color: #bb7cc8;
    padding: 1vh 0 1.5vh;
    border-bottom: 1px solid #ccafd1;
  }
}
</style>
