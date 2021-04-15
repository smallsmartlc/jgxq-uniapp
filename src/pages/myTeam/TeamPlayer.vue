<template>
	<scroll-view scroll-y style="height: 100%;width: 100%;">
		<view v-for="item in playerList" :key="item.id">
			<view style="background-color:#f7f7f7;padding:5px;color:#666;">{{item.name}}</view>
			<view v-for="player in item.playerList" :key="player.id">
				<navigator :url="`../playerDetail/playerDetail?id=${item.id}`">
					<PlayerItem :player="player"></PlayerItem>
				</navigator>
			</view>
		</view>
	</scroll-view>
</template>

<script>
	import {getTeamMembers} from '@/api/player.js'
	import PlayerItem from '../../components/PlayerItem.vue'
	export default {
		props:{
			team: Object,
		},
		components: {
			PlayerItem,
		},
		data() {
			return {
				playerList : [],
			}
		},
		mounted() {
			this.load();
		},
		methods: {
			load(){
				getTeamMembers(this.team.id).then((res)=>{
					if(res.code==200){
						this.playerList = res.data;
					}
				})     
			}
		},
	}
</script>

<style scoped>
</style>
