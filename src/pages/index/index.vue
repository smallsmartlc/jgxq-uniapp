<template>
	<view>
		
		<u-tabbar active-color="#fc0" :list="tabbar" :mid-button="true"></u-tabbar>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				tabbar: null,
			}
		},
		onLoad() {
			// 加载导航栏参数
			uni.getStorage({
				key : "tabbar",
				success: (res)=>{
					this.tabbar = res.data;
				}
			});
		},
		methods: {
		},
	}
</script>

<style>
	
</style>
