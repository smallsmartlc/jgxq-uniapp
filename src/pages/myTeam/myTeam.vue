<template>
	<view style="background-color: #FbFbFb;">
		<view v-if="team">
			<u-tabs-swiper style="box-shadow: 0 2px 3px #f7f7f7;" active-color="#fc0" ref="uTabs" :list="tabs" :current="current" @change="change"></u-tabs-swiper>
			<swiper style="height: calc(100vh - 180rpx);" :current="current" 
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
		<view style="padding-top: 400rpx;" v-else>
			<u-empty text="你还没有设置主队" src="heart-fill"></u-empty>
			<view style="text-align: center;margin-top: 80rpx;">
				<u-button @click="setTeam" size="medium" type="primary" plain ripple>立即设置</u-button>
			</view>
		</view>
		<u-tabbar active-color="#fc0" :list="tabbar" :mid-button="true"></u-tabbar>
	</view>
</template>

<script>
	import TeamDynamic from './TeamDynamic.vue'
	import TeamMatches from './TeamMatches.vue'
	import TeamPlayer from './TeamPlayer.vue'
	import TeamInfo from './TeamInfo.vue'
	export default {
		components: {
			TeamDynamic,
			TeamMatches,
			TeamPlayer,
			TeamInfo
		},
		data() {
			return {
				tabbar: null,
				team: null,
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
				// swiperCurrent : 0,
			}
		},
		onLoad() {},
		onShow() {
			// 加载导航栏参数
			this.tabbar = getApp().globalData.tabbar;
			if (getApp().globalData.userInfo) {
				this.team = getApp().globalData.userInfo.homeTeam;
			}
		},
		methods: {
			setTeam() {
				uni.navigateTo({
					url: "../teamSet/teamSet"
				})
			},
			// 由于swiper的内部机制问题，快速切换swiper不会触发dx的连续变化，需要在结束时重置状态
			// swiper滑动结束，分别设置tabs和swiper的状态
			animationfinish(e) {
				let current = e.detail.current;
				this.$refs.uTabs.setFinishCurrent(current);
				this.current = current;
			},
			change(index) {
				this.current = index;
			}
		}
	}
</script>

<style scoped>
	.swiper-item {
		height: 100%;
	}
</style>
