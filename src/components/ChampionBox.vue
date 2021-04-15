<template>
	<view>
		<view class="info-title">{{title}}</view>
		<view class="info" v-for="(item, index) in items" :key="index">
			<view class="item-title">{{item.name}}<text style="font-size:20px;margin:0 5px">{{item.time.length}}</text>个</view>
			<view class="cup-container">
				<view class="cup-item" v-for="(time,i2) in item.time" :key = "index + '-' +i2">
					<view><u-icon color="#fc0" name="jiangbei" custom-prefix="custom-icon" size="80"></u-icon></view>
					<view>{{time}}</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			title: String,
			items: Array,
		},
	}
</script>

<style scoped>
	.info{
		border-bottom: 8rpx solid #f2f2f2;
		padding: 20rpx;
	}
	.info-title {
		height: 100rpx;
		background-color: #e7e7e7;
		padding-left: 20rpx;
		font-size: 12px;
		display: flex;
		align-items: center;
	}
	.item-title{
		text-align: center;
		margin-bottom: 20rpx;
	}
	.cup-container{
		display: flex;
		flex-wrap: wrap;
	}
	.cup-item{
		width: 25%;
		font-size: 8px;
		display: flex;
		align-items: center;
		flex-direction: column;
		margin-bottom: 20rpx;
	}
</style>
