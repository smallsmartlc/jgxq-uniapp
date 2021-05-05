<template>
	<view>
		<u-navbar :background="backgroundStyle" immersive back-icon-color="#fff" :border-bottom="false"></u-navbar>
		<view class="wrap">
			<view class="header">
				<u-image class="bg-img" :src="require('../../static/match-bg.jpg')" width="750" height="400"></u-image>
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
		</view>
	</view>
</template>

<script>
	import {
		getMatchById
	} from '@/api/match'
	export default {
		data() {
			return {
				match: null,
				backgroundStyle: {
					background: 'transparent',
				}
			}
		},
		methods: {
			getMatchById(id) {
				getMatchById(id).then((res) => {
					if (res.code == 200) {
						this.match = res.data;
					}
				})
			},
			toTeamDetail(id) {
				uni.navigateTo({
					url: `../teamDetail/teamDetail?id=${id}`
				});
			}
		},
		onLoad(option) {
			this.getMatchById(option.id);
		},
		computed:{
			matchStatus(){
				if(!this.match) return ""
				return this.$utils.getMatchStatus(this.match.startTime);
			}
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
</style>
