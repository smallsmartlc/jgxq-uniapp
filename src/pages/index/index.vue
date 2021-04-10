<template>
	<view>
		<HomeSwiper :news="newsSwiperList"></HomeSwiper>
		<view class="match-banner">
			<block v-if="lastMatches.length > 0" v-for="(item,index) in lastMatches">
				<block v-if="lastMatches.length > 1">
					<MatchBox style="height:100%" :match="item"></MatchBox>
					<view class="divider" v-if="index%2==0"></view>
				</block>
				<MatchBanner v-else :match="item"></MatchBanner>
			</block>
		</view>
		<block v-for="item in topNews" :key="item.id">
			<navigator :url="`../newsDetail/newsDetail?id=${item.id}`">
				<NewsBox :news="item" top></NewsBox>
			</navigator>
		</block>
		<block v-for="item in newsList" :key="item.id">
			<navigator :url="`../newsDetail/newsDetail?id=${item.id}`">
				<NewsBox :news="item"></NewsBox>
			</navigator>
		</block>
		<u-loadmore :status="loadingStatus" :load-text="loadText" />
		<u-tabbar active-color="#fc0" :list="tabbar" :mid-button="true"></u-tabbar>
	</view>
</template>

<script>
	import {homeNews,pageNews} from '@/api/news.js'
	import {pageMatches} from '@/api/match.js'
	import NewsBox from '@/components/NewsBox.vue'
	import HomeSwiper from './HomeSwiper.vue'
	import MatchBanner from '@/components/MatchBanner.vue'
	import MatchBox from '@/components/MatchBox.vue'
	export default {
		components: {
			HomeSwiper,
			NewsBox,
			MatchBox,
			MatchBanner
		},
		data() {
			return {
				tabbar: null,
				topNews: [],
				pageNum: 0,
				pageSize: 10,
				total: 1,
				loading: false,
				newsList: [],
				loadText : {
					loadmore: '加载更多',
					loading: '经管雄起正在加载',
					nomore: '没有更多了'
				},
				lastMatches : [],
			}
		},
		onLoad() {
			// 加载导航栏参数
			uni.getStorage({
				key: "tabbar",
				success: (res) => {
					this.tabbar = res.data;
				}
			});
			this.refresh();
		},
		onReachBottom() {
			this.load();
		},
		onPullDownRefresh() {
			this.pageNum = 0;
			this.total = 1;
			this.newsList = [];
			this.refresh();
			uni.stopPullDownRefresh();
		},
		methods: {
			loadTop(){
				homeNews().then((res) => {
					if (res.code == 200) {
						var temp = res.data;
						this.topNews = temp;
					}
				});
			},
			load() {
				if(this.disabled) return;
				this.loading = true;
				this.pageNum++;
				pageNews(this.pageNum, this.pageSize, {
					topNews: true
				}).then((res) => {
					if (res.code == 200) {
						var temp = res.data.records;
						this.total = res.data.total
						this.newsList = this.newsList.concat(temp);
					} else this.pageNum--;
					this.loading = false
				})
			},
			loadMatch(){
				pageMatches({
					pageNum:1,
					pageSize:2,
					start:this.$moment().subtract(2,'days').format("YYYY/MM/DD HH:mm:ss")
					}).then((res)=>{
					if (res.code == 200) {
						var temp = res.data.records;
						this.lastMatches = temp;
					}
				})
			},
			refresh(){
				this.loadTop();
				this.load();
				this.loadMatch();
			}
		},
		computed: {
			noMore() {
				return this.newsList.length >= this.total
			},
			disabled() {
				var val = this.loading || this.noMore;
				return val;
			},
			loadingStatus(){
				return this.loading?'loading':this.noMore?'nomore':'loadmore'
			},
			newsSwiperList() {
				var temp = [];
				for (var i = 0; i < this.allNews.length && i < 5; i++) {
					temp.push({
						id: this.allNews[i].id,
						title: this.allNews[i].title,
						image: this.$utils.url2img(this.allNews[i].cover),
					})
				}
				return temp;
			},
			allNews() {
				return this.topNews.concat(this.newsList);
			}
		}
	}
</script>

<style scoped>
.match-banner{
	width: 750rpx;
	border-bottom: 4px solid #F2F2F2;
	display: flex;
	justify-content: space-between;
	align-items: center;
	flex-wrap : wrap;
	height: 200rpx;
}
.divider{
	height: 140rpx;
	border-left: 1px solid #F5F5EB;
}
</style>
