<template>
	<view>
		<block v-for="item in collectGroup" :key="item.createTime">
			<view class="collect-time">{{item.createTime}}</view>
			<block v-for="news in item.newslist">
				<view v-if="news">
					<navigator :url="`../newsDetail/newsDetail?id=${news.id}`">
						<NewsBox :news="news"></NewsBox>
					</navigator>
				</view>
				<view v-else>
					<NewsBox :news="{title:'已删除'}"></NewsBox>
				</view>
			</block>
		</block>
		<u-loadmore @loadmore="load()" :status="loadingStatus" :load-text="loadText" />
	</view>
</template>

<script>
	import {
		getCollectNews
	} from '@/api/user'
	import NewsBox from '@/components/NewsBox.vue'
	export default {
		components:{NewsBox},
		data() {
			return {
				loading: false,
				cur: 0,
				pageSize: 10,
				total: 1,
				collects: [],
				loadText: {
					loadmore: '加载更多',
					loading: '经管雄起正在加载',
					nomore: '没有更多了'
				},
			}
		},
		onLoad() {
			this.load();
		},
		methods: {
			load() {
				if (this.disabled) return;
				this.loading = true
				this.cur++;
				getCollectNews(this.cur, this.pageSize)
					.then((res) => {
						if (res.code == 200) {
							var temp = res.data.records;
							this.total = res.data.total;
							this.collects = this.collects.concat(temp);
						} else {
							this.cur--;
						}
					})
				this.loading = false
			}
		},
		onPullDownRefresh() {
			this.messages = [],
				this.cur = 0,
				this.load();
			uni.stopPullDownRefresh();
		},
		onReachBottom() {
			this.load();
		},
		computed: {
			noMore() {
				return this.collects.length >= this.total
			},
			disabled() {
				var val = this.loading || this.noMore;
				return val;
			},
			loadingStatus() {
				return this.loading ? 'loading' : this.noMore ? 'nomore' : 'loadmore'
			},
			collectGroup() {
				let newArr = [];
				if (!this.collects) return;
				this.collects.forEach(collect => {
					let index = -1;
					let isExists = newArr.some((item, j) => {
						if (item.createTime === this.$moment(collect.createTime).format(
								'yyyy-MM-DD 周dd')) {
							index = j;
							return true;
						}
					});
					if (!isExists) {
						newArr.push({
							createTime: this.$moment(collect.createTime).format('yyyy-MM-DD 周dd'),
							newslist: [collect.news]
						})
					} else {
						newArr[index].newslist.push(collect.news);
					}
				});
				return newArr;
			},
		}
	}
</script>

<style scoped>
	.collect-time{
		padding: 10rpx;
		text-align: center;
		font-size: 12px;
		background-color: #f2f2f2;
	}
</style>
