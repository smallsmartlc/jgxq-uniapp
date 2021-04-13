<template>
	<view>
		<view v-if="team">
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
	export default {
		data() {
			return {
				tabbar: null,
				team : null,
			}
		},
		onLoad() {
			this.loadTeam();
		},
		onShow() {
			// 加载导航栏参数
			this.tabbar = getApp().globalData.tabbar;
		},
		methods: {
			loadTeam() {
				uni.getStorage({
					key : "userInfo",
					success: (res)=>{
						this.team = res.data.homeTeam;
					}
				})
			},
			setTeam() {
				uni.navigateTo({
					url:"../teamSet/teamSet"
				})
			}
		}
	}
</script>

<style>

</style>
