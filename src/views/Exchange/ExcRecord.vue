<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import ERecordCard from '@/components/exchange/ERecordCard.vue'
import { importImg } from '@/utils/utils'
import { useExchangeStore } from '@/stores/exchange'
const exchangeStore = useExchangeStore()
const imgObj = {
  emptyStateUrl: importImg('image/exchange/emptyState.png')
}

// 获取路由传递过来的数据
const route = useRoute()
const estimated_currency = computed(() => route.query.estimated_currency)

// 加载兑换记录数据
const exchangeRecords = ref([])
onMounted(async () => {
  await exchangeStore.getExchangeRecord()
  exchangeRecords.value = exchangeStore.exchangeRecord
})
</script>

<template>
  <div class="ExcRecordContainer">
    <!-- 有兑换记录数据 -->
    <div class="content" v-if="exchangeRecords?.length">
      <ERecordCard
        v-for="item in exchangeRecords"
        :obj="item"
        :estimated_currency="estimated_currency"
      ></ERecordCard>
      <p>{{ $t('exchange.record.data_all') }}</p>
    </div>
    <!-- 无兑换记录数据 -->
    <div v-else-if="exchangeRecords == null" class="empty">
      <van-image width="55vw" height="18vh" lazy-load :src="imgObj.emptyStateUrl" />
      {{ $t('exchange.record.data_empty') }}
    </div>
    <LoadPage style="min-height: 100vh" v-else></LoadPage>
  </div>
</template>
<style scoped>
.ExcRecordContainer {
  min-height: 100vh;
  background-color: #fff8eb;
  background-image: url('@/assets/image/exchange/curtain.png');
  background-repeat: no-repeat;
  background-size: contain;
  overflow: hidden;
  .content {
    margin-top: 9vh;
    padding: 0 5.7vw;
    padding-bottom: 5vh;
    > P {
      font-size: 3.2vw;
      color: #999999;
      text-align: center;
    }
  }
  .empty {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-size: 4.2vw;
    color: #999999;
  }
}
</style>
