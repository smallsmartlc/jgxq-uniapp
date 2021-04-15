<template>
	<view class="container">
		<view class="info-title">{{title}}</view>
		<view class="info" v-for="(item, index) in items" :key="index">
			<view class="name">{{item.name}}</view>
			<view class="value">{{item.value}}</view>
		</view>
	</view>

</template>

<script>
	export default {
		props: {
			title: String,
			items: Array,
			height: String
		},
	}
</script>

<style scoped>
	.info-title {
		height: 60rpx;
		background-color: #e7e7e7;
		padding-left: 20rpx;
		font-size: 12px;
		display: flex;
		align-items: center;
	}
	.info{
		height: 80rpx;
		display: flex;
		font-size: 10px;
		align-items: center;
		padding-left: 20rpx;
		border-bottom:1px solid #E6E4DC;
	}
	.info .name {
		color:#666;
		margin-right:20rpx;
	}
</style>
