<template>
	<view>
		<view v-if="team">
			<u-tabs-swiper ref="uTabs" is-scroll :list="tabs" :current="current" @change="change"></u-tabs-swiper>
			<swiper :current="current" @transition="transition" @animationfinish="animationfinish">
				<swiper-item class="swiper-item">
					<TeamDynamic>
						
					</TeamDynamic>
				</swiper-item>
				<swiper-item class="swiper-item">
					<scroll-view scroll-y style="height: 800rpx;width: 100%;" @scrolltolower="onreachBottom">
						试两试
					</scroll-view>
				</swiper-item>
				<swiper-item class="swiper-item">
					<scroll-view scroll-y style="height: 800rpx;width: 100%;" @scrolltolower="onreachBottom">
						试三试
					</scroll-view>
				</swiper-item>
				<swiper-item class="swiper-item">
					<scroll-view scroll-y style="height: 800rpx;width: 100%;" @scrolltolower="onreachBottom">
						试试就逝世
					</scroll-view>
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
	export default {
		components:{
			TeamDynamic,
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
		onLoad() {
		},
		onShow() {
			// 加载导航栏参数
			this.tabbar = getApp().globalData.tabbar;
			if(getApp().globalData.userInfo){
				this.team = getApp().globalData.userInfo.homeTeam;
			}
		},
		methods: {
			setTeam() {
				uni.navigateTo({
					url: "../teamSet/teamSet"
				})
			},
			transition(e) {
				let dx = e.detail.dx;
				this.$refs.uTabs.setDx(dx);
			},
			// 由于swiper的内部机制问题，快速切换swiper不会触发dx的连续变化，需要在结束时重置状态
			// swiper滑动结束，分别设置tabs和swiper的状态
			animationfinish(e) {
				let current = e.detail.current;
				this.$refs.uTabs.setFinishCurrent(current);
				this.current = current;
			},
		}
	}
</script>

<style>

</style>
