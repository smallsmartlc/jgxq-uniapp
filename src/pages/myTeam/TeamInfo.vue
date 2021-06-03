<template>
	<scroll-view v-if="team" scroll-y style="height: 100%;width: 100%;">
		<block v-if="team.infos">
			<InfosBox v-if="team.infos.normal" title = "基本信息" :items = 'team.infos.normal'></InfosBox>
			<InfosBox v-if="team.infos.contact" title = "联系方式" :items = 'team.infos.contact'></InfosBox>
			<ChampionBox v-if="team.infos.champions" title = "荣誉记录" :items = 'team.infos.champions'></ChampionBox>
		</block>
		
	</scroll-view>
</template>

<script>
	import {getTeamById} from '@/api/team'
	import InfosBox from '@/components/InfosBox.vue'
	import ChampionBox from '@/components/ChampionBox.vue'
	export default {
		props:{
			team: Object,
		},
		components: {
			InfosBox,ChampionBox
		},
		data() {
			return {
			}
		},
		mounted() {
		},
		methods: {
		},
	}
</script>

<style scoped>
</style>
