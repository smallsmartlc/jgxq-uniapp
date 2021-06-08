<template>
	<view>
		<u-navbar :background="backgroundStyle" immersive back-icon-color="#fff" :border-bottom="false"></u-navbar>
		<view class="wrap">
			<view class="header">
				<u-image class="bg-img" :src="require('@/static/match-bg.jpg')" width="750" height="300"></u-image>
				<view v-if="team" class="team-box">
					<view class="team-info">
						<view class="logo">
							<u-image :src="$utils.url2img(team.logo)" width="110" height="110"></u-image>
						</view>
						<view class="name">{{team.name}}</view>
						<view class="en-name">{{team.enName}}</view>
					</view>
				</view>
			</view>
			<view v-if="team" style="background-color: #FbFbFb;">
				<u-tabs-swiper style="box-shadow: 0 2px 3px #f7f7f7;" active-color="#fc0" ref="uTabs" :list="tabs" :current="current" @change="change"></u-tabs-swiper>
				<swiper style="height: calc(100vh - 380rpx);" :current="current" 
					@animationfinish="animationfinish">
					<swiper-item class="swiper-item">
						<TeamDynamic :team="team"></TeamDynamic>
					</swiper-item>
					<swiper-item class="swiper-item">
						<TeamMatches :team="team"></TeamMatches>
					</swiper-item>
					<swiper-item class="swiper-item">
						<TeamPlayer :team="team"></TeamPlayer>
					</swiper-item>
					<swiper-item class="swiper-item">
						<TeamInfo :team="team"></TeamInfo>
					</swiper-item>
				</swiper>
			</view>
		</view>
	</view>
</template>

<script>
	import {getTeamById} from '@/api/team'
	import {getTeamMembers} from '@/api/player'
	import {pageNewsByTag} from '@/api/news'
	import TeamDynamic from "../../pages/myTeam/TeamDynamic.vue"
	import TeamMatches from '../../pages/myTeam/TeamMatches.vue'
	import TeamPlayer from '../../pages/myTeam/TeamPlayer.vue'
	import TeamInfo from '../../pages/myTeam/TeamInfo.vue'
	export default {
		components: {
			TeamDynamic,
			TeamMatches,
			TeamPlayer,
			TeamInfo
		},
		data() {
			return {
				team : null,
				tabs: [{
					name: '动态'
				}, {
					name: '赛程'
				}, {
					name: '球员'
				}, {
					name: '资料'
				}],
				current: 0,
				backgroundStyle: {
					background: 'transparent',
				},
			}
		},
		methods: {
			getTeamById(id){
				getTeamById(id).then((res)=>{
					if(res.code == 200){
						this.team = res.data;
					}
				})
			},
			animationfinish(e) {
				let current = e.detail.current;
				this.$refs.uTabs.setFinishCurrent(current);
				this.current = current;
			},
			change(index) {
				this.current = index;
			}
		},
		onLoad(option) {
			this.getTeamById(option.id);
		}
	}
</script>

<style scoped>
	.header {
		width: 750rpx;
		height: 300rpx;
	}
	.bg-img {
		position: absolute;
		z-index: -100;
	}
	.team-box {
		width: 750rpx;
		height: 300rpx;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.team-info{
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	.logo{
	}
	.name{
		font-size: 16px;
		color: #fff;
		margin: 10rpx 0;
	}
	.en-name{
		font-size: 8px;
		color: rgba(255,255,255,0.7);
	}
</style>
 