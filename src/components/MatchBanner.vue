<template>
	<view class="container">
		<view class="team-box">
			<view class="team-info">
				<view style="margin-bottom: 8rpx;">
					<u-image :src="$utils.url2img(match.homeTeam?match.homeTeam.logo:null)" width="80rpx" height="80rpx"></u-image>
				</view>
				<view>{{match.homeTeam?match.homeTeam.name:'已删除'}}</view>
			</view>
		</view>
		<view class="center">
			<view class="title">{{match.title}}</view>
			<view>
				<view class="time" v-if="matchStatus == '未开始'">
					{{$utils.getDayStr(match.startTime)}}&nbsp;{{$moment(match.startTime).format("HH:mm")}}
				</view>
				<view :style="color" class="score" v-else>
					<view style="text-align: right;">{{match.homeScore}}</view>
					<text style="margin: 0 40rpx;">-</text>
					<view style="text-align: left;">{{match.visitingScore}}</view>
				</view>
			</view>
			<view class="live" v-if="matchStatus == '进行中' && match.link">
				<u-icon name="play-right-fill"></u-icon>
				<u-link :href="match.link" font-size="20" color="#fff">
					<text>视频直播中</text>
				</u-link>
			</view>
			<view v-else class="status" :style="color">{{matchStatus}}</view>
		</view>
		<view class="team-box">
			<view class="team-info">
				<view style="margin-bottom: 8rpx;">
					<u-image :src="$utils.url2img(match.visitingTeam?match.visitingTeam.logo:null)" width="80rpx" height="80rpx"></u-image>
				</view>
				<view>{{match.visitingTeam?match.visitingTeam.name:'已删除'}}</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "MatchBanner",
		props: {
			match: Object,
		},
		data() {
			return {

			};
		},
		computed:{
			matchStatus(){
				return this.$utils.getMatchStatus(this.match.startTime);
			},
			color(){
				return this.matchStatus == '进行中' ? "color:#fc0;" : '';
			}
		}
	}
</script>

<style scoped>
	.container{
		display: flex;
		padding: 12rpx;
	}
	.team-box{
		width: 230rpx;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.team-box .team-info{
		display: flex;
		flex-direction: column;
		align-items: center;
		font-size: 10px;
	}
	.center {
		width: 290rpx;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}
	.title {
		text-align: center;
		font-size: 12px;
	}
	.time{
		text-align: center;
		font-size: 16px;
	}
	.score{
		display: flex;
		justify-content: center;
		font-size: 24px;
		margin: 4px 0;
	}
	.score view{
		width: 48px;
	}
	.live{
		color: #fff;
		background-color: #fc0;
		font-size: 8px;
		text-align: center;
		width: fit-content;
		padding: 2px 4px;
		border-radius: 2px;
		margin: 0px auto;
	}
	.status{
		font-size: 10px;
		color: #666;
		text-align: center;
	}
</style>
