<template>
	<scroll-view scroll-y style="height: 100%;width: 100%;" @scrolltolower="onreachBottom">
		<view v-if="list.length">
			<navigator :url="`../newsDetail/newsDetail?id=${item.id}`" v-for="item in list" :key="item.id">
				<NewsBox :news="item"></NewsBox>
			</navigator>
			<u-loadmore :status="status" :load-text="loadText" />
		</view>
		<view class="empty" v-else>
			<u-empty text="暂无资讯" mode="news"></u-empty>
		</view>
	</scroll-view>
</template>

<script>
	import NewsBox from '@/components/NewsBox.vue'
	export default {
		components:{NewsBox},
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
