<template>
	<scroll-view v-if="teamInfo" scroll-y style="height: 100%;width: 100%;">
		<InfosBox v-if="teamInfo.infos.normal" title = "基本信息" :items = 'teamInfo.infos.normal'></InfosBox>
		<InfosBox v-if="teamInfo.infos.contact" title = "联系方式" :items = 'teamInfo.infos.contact'></InfosBox>
		<ChampionBox v-if="teamInfo.infos.champions" title = "荣誉记录" :items = 'teamInfo.infos.champions'></ChampionBox>
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
				teamInfo : null,
			}
		},
		mounted() {
			this.load();
		},
		methods: {
			load(){
				getTeamById(this.team.id).then((res)=>{
					if(res.code == 200){
						this.teamInfo = res.data;
					}
				})
			}
		},
	}
</script>

<style scoped>
</style>
