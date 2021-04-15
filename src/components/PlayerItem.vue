<template>
	<view class="container">
		<view class="player">
			<view style="margin-right: 20rpx;">
				<u-avatar :size="120" :src="$utils.url2img(player.headImage)" img-mode="aspectFill"></u-avatar>
			</view>
			<view>
				{{player.name}}
			</view>
		</view>
		<view class="info">
			{{player.age}}岁·{{player.number}}号·{{player.nation}}
		</view>
	</view>
</template>

<script>
	export default {
		name:"PlayerItem",
		data() {
			return {
				
			};
		},
		props:{
			player : Object,
		}
	}
</script>

<style scoped>
	.container{
		height: 160rpx;
		border-bottom: 2px solid #f7f7f7;
		padding: 20rpx;
		display: flex;
		justify-content: space-between;
	}
	.player{
		display: flex;
		align-items: center;
	}
	.info{
		display: flex;
		align-items: center;
	}
</style>
