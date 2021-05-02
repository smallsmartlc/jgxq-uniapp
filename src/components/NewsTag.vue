<template>
	<view v-if="tag" class="container">
		<u-icon style="margin-right: 4rpx;" size="32" :name="$utils.url2img(tag.logo)"></u-icon>
		<text>{{tag.name}}</text>
	</view>
</template>

<script>
	export default {
		name:"NewsTag",
		props : {
			tag : Object,
		},
		data() {
			return {
				
			};
		}
	}
</script>

<style scoped>
.container{
	font-size: 12px;
	width: auto;
	border: 1px solid #e7e7e7;
	background-color: #fff;
	border-radius: 4px;
	margin-right: 16rpx;
	display: flex;
	padding: 8rpx;
}
</style>
