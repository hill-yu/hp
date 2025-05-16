<script setup>
const props = defineProps(['img-url', 'wid', 'hei'])
const backgroundStyle = {
  '--background-image': `url(${props.imgUrl})`,
  '--width': `${props.wid}vw`,
  '--height': `${props.hei}vh`
}
</script>

<template>
  <div class="icon-btn" :style="backgroundStyle"></div>
</template>
<style scoped>
.icon-btn {
  display: inline-block;
  width: var(--width);
  height: var(--height);
  background-image: var(--background-image);
  background-repeat: no-repeat;
  background-size: var(--width) var(--height);
}
</style>
