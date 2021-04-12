<template>
	<view class="container">
		<view class="title">
			<text>{{$moment(match.startTime).format('HH:mm')}}&nbsp;{{match.title}}</text>
		</view>
		<view class="content">
			<view class="team-box left">
				<u-image :src="$utils.url2img(match.homeTeam?match.homeTeam.logo:null)" width="60rpx" height="60rpx"></u-image>
				<text>{{match.homeTeam?match.homeTeam.name:'已删除'}}</text>
			</view>
			<view :style="color" class="score">
				<view style="text-align: right;">{{match.homeScore}}</view>
				<text style="margin: 0 10rpx;">-</text>
				<view style="text-align: left;">{{match.visitingScore}}</view>
			</view>
			<view class="team-box right">
				<u-image :src="$utils.url2img(match.visitingTeam?match.visitingTeam.logo:null)" width="60rpx" height="60rpx"></u-image>
				<text>{{match.visitingTeam?match.visitingTeam.name:'已删除'}}</text>
			</view>
		</view>
		<view class="status">
			<block v-if="match.link">
				<view v-if="matchStatus=='未开始'">视频直播</view>
				<view v-else-if="matchStatus == '进行中'" class="button live">
					<u-icon name="play-right-fill"></u-icon>
					<text>视频直播中</text>
				</view>
				<view v-else class="button liveover">
					<u-icon name="video" custom-prefix="custom-icon"></u-icon>
					<text>比赛集锦</text>
				</view>
			</block>
			<block v-else>
				<view v-if="matchStatus=='未开始'">直播信息待更新</view>
				<view v-else-if="matchStatus=='进行中'">进行中</view>
				<view v-else class="button over">已结束</view>
			</block>
		</view>
	</view>
</template>

<script>
	export default {
		name:"MatchItem",
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
		border-bottom: 1px solid #f2f2f2;
		padding: 12rpx;
	}
	.title{
		font-size: 10px;
		text-align: center;
		line-height: 24px;
	}
	.content{
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.team-box{
		display: flex;
		font-size: 12px;
		align-items: center;
		width: 300rpx;
	}
	.left{
		flex-direction: row-reverse;
	}
	.right{
		flex-direction: row;
	}
	.team-box .u-image{
		margin: 12rpx;
	}
	.score{
		width: 180rpx;
		display: flex;
		justify-content: center;
		font-size: 40rpx;
	}
	.score view{
		width: 48px;
	}
	.status{
		font-size: 8px;
		color: #666;
		text-align: center;
	}
	.button{
		text-align: center;
		width: fit-content;
		padding: 1px 4px;
		border-radius: 2px;
		margin: 0 auto;
	}
	.live{
		color: #fff;
		background-color: #fc0;
	}
	.over{
		color: #666;
		background-color: #f2f2f2;
	}
	.liveover{
		color: #fc0;
		border: 1px solid #fc0;
	}
</style>
