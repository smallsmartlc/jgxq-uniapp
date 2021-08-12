<template>
	<view>
		<u-navbar :background="backgroundStyle" immersive back-icon-color="#fff" :border-bottom="false"></u-navbar>
		<view class="wrap">
			<view class="header">
				<u-image class="bg-img" :src="require('@/static/match-bg.jpg')" width="750" height="400"></u-image>
				<view v-if="player" class="player-box">
					<view class="player-info">
						<view class="headImage">
							<u-image :src="$utils.url2img(player.headImage)" width="110" height="110" shape="circle"></u-image>
						</view>
						<view class="name">{{player.name}}</view>
						<view class="en-name">{{player.enName}}</view>
						<view class="en-name">
							<text>身高{{player.height}}cm</text>
							<text>/</text>
							<text>体重{{player.weight}}kg</text>
							<text>/</text>
							<text>{{player.nation}}</text>
						</view>
					</view>
					<view class="info-footer">
						<view class="box"><text v-if="player.birthday">{{$moment().diff($moment(player.birthday),'year')}}岁</text></view>
						<view class="box center">{{player.team?player.team.name:"自由球员"}}/{{player.number}}号</view>
						<view class="box">{{player.position}}/{{player.strongFoot}}</view>
					</view>
				</view>
			</view>
			<view v-if="player" style="background-color: #FbFbFb;">
				<u-tabs-swiper style="box-shadow: 0 2px 3px #f7f7f7;" active-color="#fc0" ref="uTabs" :list="tabs" :current="current" @change="change"></u-tabs-swiper>
				<swiper style="height: calc(100vh - 480rpx);" :current="current" 
					@animationfinish="animationfinish">
					<swiper-item class="swiper-item">
						<PlayerDynamic :player="player"></PlayerDynamic>
					</swiper-item>
					<swiper-item class="swiper-item">
						<PlayerInfo :player="player"></PlayerInfo>
					</swiper-item>
				</swiper>
			</view>
		</view>
	</view>
</template>

<script>
	import PlayerDynamic from './PlayerDynamic.vue'
	import PlayerInfo from './PlayerInfo.vue'
	import {getPlayerById} from '@/api/player'
	export default {
		components:{PlayerDynamic,PlayerInfo},
		data() {
			return {
				player: null,
				backgroundStyle: {
					background: 'transparent',
				},
				tabs: [{
					name: '动态'
				}, {
					name: '资料'
				}],
				current: 0,
			}
		},
		methods: {
			getPlayerById(id){
				getPlayerById(id).then((res)=>{
					if(res.code == 200){
						this.player = res.data;
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
			this.getPlayerById(option.id);
		}
	}
</script>

<style scoped>
	.header {
		width: 750rpx;
		height: 360rpx;
	}
	.bg-img {
		position: absolute;
		z-index: -100;
	}
	.player-box {
		width: 750rpx;
		height: 360rpx;
		display: flex;
		align-items: center;
		flex-direction: column;
	}
	.player-info{
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		height: 280rpx;
	}
	.headImage{
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
	.info-footer{
		color: #fff;
		display: flex;
		justify-content: space-around;
		font-size: 12px;
		width: 750rpx;
		height: 80rpx;
		padding: 20rpx;
	}
	.info-footer .box{
		margin: 0 20rpx;
		text-align: center;
		width: 150rpx;
	}
	.info-footer .center{
		width: 400rpx !important;
		border-left: 1px solid rgba(255,255,255,0.3);
		border-right: 1px solid rgba(255,255,255,0.3);
	}
</style>
