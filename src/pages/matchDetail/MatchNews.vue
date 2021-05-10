<template>
	<scroll-view scroll-y style="height: 100%;width: 100%;" @scrolltolower="onreachBottom">
		<view v-if="list.length">
			
		</view>
		<view class="empty" v-else>
			<u-empty text="暂无资讯" mode="news"></u-empty>
		</view>
	</scroll-view>
</template>

<script>
	export default {
		data() {
			return {
				loadText : {
					loadmore: '加载更多',
					loading: '经管雄起正在加载',
					nomore: '没有更多了'
				},
			}
		},
		props: {
			list : Array,
			status : String,
		},
		methods:{
			onreachBottom(){
				this.$emit("load");
			}
		}
	}
</script>

<style scoped>
	.empty {
		padding: 40rpx 0;
	}
</style>
