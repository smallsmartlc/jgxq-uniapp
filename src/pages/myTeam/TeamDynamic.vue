<template>
	<scroll-view scroll-y style="width: 100%;height: 100%;" @scrolltolower="onreachBottom">
		<view class="match-banner" v-if="lastMatches.length">
			<block v-for="(item,index) in lastMatches" :key="item.id">
				<block v-if="lastMatches.length > 1">
					<navigator :url="`../matchDetail/matchDetail?id=${item.id}`">
						<MatchBox style="height:100%" :match="item"></MatchBox>
					</navigator>
					<view class="divider" v-if="index%2==0"></view>
				</block>
				<navigator v-else :url="`../matchDetail/matchDetail?id=${item.id}`">
					<MatchBanner :match="item"></MatchBanner>
				</navigator>
			</block>
		</view>
		<block v-for="item in news" :key="item.id">
			<navigator :url="`../newsDetail/newsDetail?id=${item.id}`">
				<NewsBox :news="item"></NewsBox>
			</navigator>
		</block>
		<u-loadmore :status="loadingStatus" :load-text="loadText" />
	</scroll-view>
</template>

<script>
	import MatchBanner from '@/components/MatchBanner.vue'
	import MatchBox from '@/components/MatchBox.vue'
	import NewsBox from '@/components/NewsBox.vue'
	import {
		pageMatches
	} from '@/api/match.js'
	import {
		pageNewsByTag
	} from '@/api/news'
	export default {
		components: {
			MatchBox,
			MatchBanner,
			NewsBox
		},
		data() {
			return {
				lastMatches: [],
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
			this.loadMatch();
			this.loadNews();
		},
		props: {
			team: Object,
		},
		methods: {
			onreachBottom() {
				this.loadNews();
			},
			loadNews() {
				this.loading = true,
					this.cur++;
				pageNewsByTag(this.cur, this.pageSize, this.team.id, 0).then((res) => {
					if (res.code == 200) {
						var temp = res.data.records;
						this.total = res.data.total
						this.news = this.news.concat(temp);
					} else this.cur--;
				})
				this.loading = false;
			},
			loadMatch() {
				pageMatches({
					pageNum: 1,
					pageSize: 2,
					teamId: this.team.id,
					start: this.$moment().subtract(2, 'days').format("YYYY/MM/DD HH:mm:ss")
				}).then((res) => {
					if (res.code == 200) {
						var temp = res.data.records;
						this.lastMatches = temp;
					}
				});
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
	.match-banner {
		width: 750rpx;
		border-bottom: 4px solid #F2F2F2;
		display: flex;
		justify-content: space-between;
		align-items: center;
		flex-wrap: wrap;
		height: 200rpx;
	}

	.divider {
		height: 140rpx;
		border-left: 1px solid #F5F5EB;
	}
</style>
