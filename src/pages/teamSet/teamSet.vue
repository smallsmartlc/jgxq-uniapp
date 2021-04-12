<template>
	<view>
		<view class="search-box">
			<u-search placeholder="搜索球队" v-model="keyword"></u-search>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				keyword : null,
			}
		},
		methods: {
			
		}
	}
</script>

<style>
.search-box{
	padding:20rpx 40rpx;
	border-bottom: 1px solid #e7e7e7;
}
</style>
