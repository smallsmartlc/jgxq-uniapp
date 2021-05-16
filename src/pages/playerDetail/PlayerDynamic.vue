<template>
	<scroll-view scroll-y style="width: 100%;height: 100%;" @scrolltolower="onreachBottom">
		<view v-if="news.length">
			<view v-for="item in news" :key="item.id">
				<navigator :url="`../newsDetail/newsDetail?id=${item.id}`">
					<NewsBox :news="item"></NewsBox>
				</navigator>
			</view>
			<u-loadmore :status="loadingStatus" :load-text="loadText" />
		</view>
		<view v-else class="empty">
			<u-empty text="暂无动态" mode="news"></u-empty>
		</view>
	</scroll-view>
</template>

<script>
	import NewsBox from '@/components/NewsBox.vue'
	import {
		pageNewsByTag
	} from '@/api/news'
	export default {
		components: {
			NewsBox
		},
		data() {
			return {
				news: [],
				total: 1,
				cur: 0,
				pageSize: 10,
				loading: false,
				loadText : {
					loadmore: '加载更多',
					loading: '经管雄起正在加载',
					nomore: '没有更多了'
				},
			}
		},
		mounted() {
			this.loadNews();
		},
		props: {
			player: Object,
		},
		methods: {
			onreachBottom() {
				this.loadNews();
			},
			loadNews() {
				if(this.disabled) return;
				this.loading = true,
				this.cur++;
				pageNewsByTag(this.cur, this.pageSize, this.player.id, 1).then((res) => {
					if (res.code == 200) {
						var temp = res.data.records;
						this.total = res.data.total
						this.news = this.news.concat(temp);
					} else this.cur--;
				})
				this.loading = false;
			},
		},
		computed: {
			noMore() {
				return this.news.length >= this.total
			},
			disabled() {
				return this.loading || this.noMore
			},
			loadingStatus(){
				return this.loading?'loading':this.noMore?'nomore':'loadmore'
			},
		},
	}
</script>

<style scoped>
	.empty {
		padding: 40rpx 0;
	}
</style>