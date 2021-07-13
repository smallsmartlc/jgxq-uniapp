<template>
	<view>
		<u-navbar :background="backgroundStyle" immersive back-icon-color="#fff" :border-bottom="false"></u-navbar>
		<view class="wrap">
			<view class="header">
				<u-image class="bg-img" :src="require('@/static/match-bg.jpg')" width="750" height="400"></u-image>
				<view v-if="match" class="match-info">
					<view v-if="match.homeTeam" class="team-box" @click="toTeamDetail(match.homeTeam.id)">
						<view class="logo">
							<u-image :src="$utils.url2img(match.homeTeam.logo)" width="110" height="110"></u-image>
						</view>
						<view class="name">{{match.homeTeam.name}}</view>
					</view>
					<view class="info-box">
						<block v-if="matchStatus=='未开始'">
							<view class="title">{{match.title}}</view>
							<view class="time">{{this.$utils.matchTimeFormat(match.startTime)}}</view>
						</block>
						<block v-else>
							<view class="title">
								<text style="margin-right: 4px;" :class="matchStatus=='进行中'?'going':''">{{this.$utils.matchTimeFormat(match.startTime)}}</text>
								<text>{{match.title}}</text>
							</view>
							<view :class="matchStatus=='进行中'?'score going':'score'">
								<view style="text-align: right;">{{match.homeScore}}</view>
								<text style="margin: 0 40rpx;">-</text>
								<view style="text-align: left;">{{match.visitingScore}}</view>
							</view>
						</block>
						<view v-if="match.link" class="link">
							<view class="live">
								<u-icon name="play-right-fill"></u-icon>
								<u-link :href="match.link" font-size="24" color="#fff">
									<text>观看比赛</text>
								</u-link>
							</view>
						</view>
						<view v-else class="status">
							<text>{{matchStatus}}</text>
						</view>
					</view>
					<view v-if="match.visitingTeam" class="team-box" @click="toTeamDetail(match.visitingTeam.id)">
						<view class="logo">
							<u-image :src="$utils.url2img(match.visitingTeam.logo)" width="110" height="110"></u-image>
						</view>
						<view class="name">{{match.visitingTeam.name}}</view>
					</view>
				</view>
			</view>
			<view v-if="match">
				<u-tabs-swiper class="swiper" active-color="#fc0" ref="uTabs" :list="tabs" :current="current" @change="change"></u-tabs-swiper>
				<swiper style="height: calc(100vh - 480rpx);" :current="current"
					@animationfinish="animationfinish">
					<swiper-item class="swiper-item">
						<MatchResult :news="match.matchNews" :action="match.actions"></MatchResult>
					</swiper-item>
					<swiper-item class="swiper-item">
						<MatchFormation :info="match.matchInfo"></MatchFormation>
					</swiper-item>
					<swiper-item class="swiper-item">
						<MatchNews :list="newsList" @load="loadNews" :status="loadingStatus"></MatchNews>
					</swiper-item>
				</swiper>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		getMatchById
	} from '@/api/match';
	import {
		pageNewsByTags
	} from '@/api/news'
	import MatchFormation from './MatchFormation.vue'
	import MatchResult from './MatchResult.vue'
	import MatchNews from './MatchNews.vue'
	export default {
		components:{MatchFormation,MatchResult,MatchNews},
		data() {
			return {
				match: null,
				matchNews : null,
				backgroundStyle: {
					background: 'transparent',
				},
				tabs: [{
					name: '赛况'
				}, {
					name: '阵容'
				}, {
					name: '资讯'
				}],
				current: 0,
				newsList: [],
				total: 1,
				cur: 0,
				pageSize: 10,
				loading: false,
			}
		},
		methods: {
			getMatchById(id) {
				getMatchById(id).then((res) => {
					if (res.code == 200) {
						this.match = res.data;
						this.loadNews();
					}
				})
			},
			toTeamDetail(id) {
				uni.navigateTo({
					url: `/subPackages/teamDetail/teamDetail?id=${id}`
				});
			},
			animationfinish(e) {
				let current = e.detail.current;
				this.$refs.uTabs.setFinishCurrent(current);
				this.current = current;
			},
			change(index) {
				this.current = index;
			},
			loadNews(){
				if(this.disabled) return;
				if(!this.match) return;
				this.loading = true,
				this.cur++;
				let tagList = [{objectId:this.match.homeTeam.id,type:0},{objectId:this.match.visitingTeam.id,type:0}]
				pageNewsByTags(this.cur, this.pageSize, tagList).then((res) => {
					if (res.code == 200) {
						var temp = res.data.records;
						this.total = res.data.total
						this.newsList = this.newsList.concat(temp);
					} else this.cur--;
				})
				this.loading = false;
			}
		},
		onLoad(option) {
			this.getMatchById(option.id);
		},
		onShareAppMessage(res) {
		    return {
		      title: this.match.title,
		      path: `/subPackages/matchDetail/matchDetail?id=${this.match.id}`
		    }
		},
		computed:{
			matchStatus(){
				if(!this.match) return ""
				return this.$utils.getMatchStatus(this.match.startTime);
			},
			loadingStatus(){
				return this.loading?'loading':this.noMore?'nomore':'loadmore';
			},
			noMore() {
				return this.newsList.length >= this.total;
			},
			disabled() {
				return this.loading || this.noMore;
			},
		}
	}
</script>

<style scoped>
	.header {
		width: 750rpx;
		height: 400rpx;
	}

	.bg-img {
		position: absolute;
		z-index: -100;
	}

	.match-info {
		width: 750rpx;
		height: 400rpx;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.team-box {
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 120rpx;
	}

	.team-box .logo {
		margin-bottom: 20rpx;
	}

	.team-box .name {
		font-size: 14px;
		color: #fff;
		white-space: nowrap;
	}
	.info-box{
		color: #fff;
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 400rpx;
		white-space: nowrap;
	}
	.info-box .title{
		font-size: 10px;
	}
	.info-box .time{
		font-size: 16px;
		margin: 10rpx 0;
	}
	.live {
		background-color: #fc0;
		font-size: 8px;
		text-align: center;
		width: fit-content;
		padding: 4px 8px;
		border-radius: 2px;
	}
	.status{
		background-color: rgba(0,0,0,0.5);
		color: #aaa;
		font-size: 12px;
		text-align: center;
		width: fit-content;
		padding: 4px 8px;
		border-radius: 4px;
	}
	.going{
		color: #fc0 !important;
	}
	.score{
		display: flex;
		justify-content: center;
		font-size: 28px;
		margin: 4px 0;
	}
	.swiper{
		box-shadow: 0 2px 3px #f7f7f7;		
	}
</style>
