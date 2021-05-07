<template>
	<scroll-view scroll-y style="height: 100%;width: 100%;">
		<view class="match-news">
			<view class="title">战报</view>
			<view v-if="news">
				<NewsBox :news="news"></NewsBox>
			</view>
			<view class="empty" v-else>
				<u-empty text="暂无战报" mode="news"></u-empty>
			</view>
		</view>
		<u-gap height="16" bg-color="#f7f7f7"></u-gap>
		<view class="actions">
			<view class="title">事件</view>
			<view v-if="action"></view>
			<view class="empty" v-else>
				<u-empty text="暂无事件" mode="history"></u-empty>
			</view>
		</view>
	</scroll-view>
</template>

<script>
	import NewsBox from "@/components/NewsBox.vue"
	export default {
		components:{NewsBox},
		props: {
			news: Object,
			action : Object,
		},
		data(){
			return {
				
			}
		},
		methods: {
			
		},
		computed: {
		}
	}
</script>

<style scoped>
	.title{
		padding: 20rpx 20rpx;
		border-bottom: 2px solid #f7f7f7;
	}
	.empty{
		padding: 40rpx 0;
	}
</style>
