<template>
	<scroll-view v-if="player" scroll-y style="height: 100%;width: 100%;">
		<InfosBox v-if="player.infos.normal" title = "基本信息" :items = 'player.infos.normal'></InfosBox>
	</scroll-view>
</template>

<script>
	import InfosBox from '@/components/InfosBox.vue'
	export default {
		props:{
			player: Object,
		},
		components: {
			InfosBox
		},
		data() {
			return {
			}
		},
		methods: {
		},
	}
</script>

<style scoped>
</style>
