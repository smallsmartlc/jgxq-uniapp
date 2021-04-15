<template>
	<scroll-view scroll-y style="height: 100%;width: 100%;" @scrolltolower="onreachBottom" @scrolltoupper="onreachTop">
		<u-loadmore v-show="!downLoading" :status="upLoadingStatus" :load-text="upLoadText" />
		<view v-for="list in matchGroup()" :key="list.startTime">
			<view class="title">{{list.startTime}}</view>
			<view v-for="item in list.matchlist" :key="item.id">
				<navigator :url="`../matchDetail/matchDetail?id=${item.id}`">
					<MatchItem :match="item"></MatchItem>
				</navigator>
			</view>
		</view>
		<u-loadmore :status="downLoadingStatus" :load-text="downLoadText" />
	</scroll-view>
</template>

<script>
	import {
		pageMatches
	} from '@/api/match.js'
	import MatchItem from '@/components/MatchItem.vue'
	export default {
		props: {
			team: Object,
		},
		components: {
			MatchItem
		},
		data() {
			return {
				pageSize: 10,
				matchDownList: [], // 下拉加载比赛列表
				downCur: 0,
				downTotal: 1,
				downLoading: false,
				matchUpList: [], // 上拉加载比赛列表
				upCur: 0,
				upTotal: 1,
				upLoading: false,
				upLoadText: {
					loadmore: '下拉查看更多历史比赛',
					loading: '经管雄起正在加载',
					nomore: '没有更多了'
				},
				downLoadText: {
					loadmore: '加载更多',
					loading: '经管雄起正在加载',
					nomore: '没有更多了'
				},
			}
		},
		mounted() {
			this.loadDown();
			this.loadUp();
		},
		methods: {
			onreachBottom(){
				this.loadDown();
			},
			onreachTop(){
				this.loadUp();
			},
			loadUp() {
				if (this.upDisabled) return;
				this.upLoading = true;
				this.upCur++;
				pageMatches({
						pageNum: this.upCur,
						pageSize: this.pageSize,
						past: true,
						teamId: this.team.id,
					})
					.then((res) => {
						if (res.code == 200) {
							var temp = res.data.records;
							this.upTotal = res.data.total;
							this.matchUpList = [...temp.reverse(), ...this.matchUpList];
						} else {
							this.upCur--;
						}
						this.upLoading = false;
					})
			},
			loadDown() {
				if (this.downDisabled) return;
				this.downLoading = true
				this.downCur++;
				pageMatches({
						teamId: this.team.id,
						pageNum: this.downCur,
						pageSize: this.pageSize
					})
					.then((res) => {
						if (res.code == 200) {
							var temp = res.data.records;
							this.downTotal = res.data.total;
							this.matchDownList = this.matchDownList.concat(temp);
						} else {
							this.downCur;
						}
						this.downLoading = false;
					})
			}
		},
		computed: {
			downNoMore() {
				return this.matchDownList.length >= this.downTotal;
			},
			downDisabled() {
				return this.downLoading || this.downNoMore;
			},
			downLoadingStatus() {
				return this.downLoading ? 'loading' : this.downNoMore ? 'nomore' : 'loadmore'
			},
			upNoMore() {
				return this.matchUpList.length >= this.upTotal;
			},
			upDisabled() {
				return this.upLoading || this.upNoMore;
			},
			upLoadingStatus() {
				return this.upLoading ? 'loading' : this.upNoMore ? 'nomore' : 'loadmore'
			},
			matchGroup() {
				return () => {
					let newArr = [];
					let matches = [...this.matchUpList, ...this.matchDownList];
					if (!matches) return;
					matches.forEach(match => {
						let index = -1;
						let isExists = newArr.some((item, j) => {
							if (item.startTime === this.$moment(match.startTime).format(
									'yyyy-MM-DD 周dd')) {
								index = j;
								return true;
							}
						});
						if (!isExists) {
							newArr.push({
								startTime: this.$moment(match.startTime).format('yyyy-MM-DD 周dd'),
								matchlist: [match]
							})
						} else {
							newArr[index].matchlist.push(match);
						}
					});
					return newArr;
				}
			},
		},
	}
</script>

<style scoped>
	.title {
		background-color: #eee;
		text-align: center;
		font-size: 10px;
		line-height: 18px;
	}
</style>
