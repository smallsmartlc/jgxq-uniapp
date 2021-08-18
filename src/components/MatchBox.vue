<template>
	<view class="container">
		<view class="title">
			<view class="title-text">{{match.title}}</view>
			<view class="status-box">
				<view class="status" :style="color">{{matchStatus}}</view>
				<view v-if="match.link && $utils.audit()" class="link">
					<u-icon name="video" custom-prefix="custom-icon" size="20"></u-icon>
					<text>视频</text>
				</view>
			</view>
		</view>
		<view class="content">
			<view class="team-box">
				<view class="box-left">
					<u-image :src="$utils.url2img(match.homeTeam?match.homeTeam.logo:null)" width="48rpx" height="48rpx"></u-image>
					<text style="margin-left: 4px;">{{match.homeTeam?match.homeTeam.name:'已删除'}}</text>
				</view>
				<view class="box-right">
					<view v-if="matchStatus == '未开始'">{{$utils.getDayStr(match.startTime)}}</view>
					<view v-else :style="color">{{match.homeScore}}</view>
				</view>
			</view>
			<view class="team-box">
				<view class="box-left">
					<u-image :src="$utils.url2img(match.visitingTeam?match.visitingTeam.logo:null)" width="48rpx" height="48rpx"></u-image>
					<text style="margin-left: 4px;">{{match.visitingTeam?match.visitingTeam.name:'已删除'}}</text>
				</view>
				<view class="box-right">
					<view v-if="matchStatus == '未开始'">{{$moment(match.startTime).format("HH:mm")}}</view>
					<view v-else :style="color">{{match.visitingScore}}</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name:"MatchBox",
		props: {
			match:Object,
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
		flex-direction: column;
		justify-content: space-between;
		width: 370rpx;
		height: 100%;
		padding: 12rpx;
	}
	.title{
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
	}
	.title-text{
		font-size: 10px;
		display: -webkit-box;
		-webkit-box-orient: vertical;   /*排列方式*/ 
		-webkit-line-clamp: 2;/*显示文本行数*/
		overflow: hidden;/*溢出隐藏*/
	}
	.status-box{
		display: flex;
		flex-direction: row-reverse;
		width: 150rpx;
		white-space:nowrap;
		margin-left: 2px;
	}
	.status{
		font-size: 8px;
		color: #666;
		margin-left: 2px;
	}
	.link{
		color: #fc0;
		border: 1px solid #fc0;
		font-size: 8px;
		border-radius: 2px;
		padding: 0 2px;
		white-space:nowrap;
		vertical-align: middle;
	}
	.team-box {
		display: flex;
		justify-content: space-between;
		font-size: 10px;
		align-items: center;
		margin-top: 8rpx;
	}
	.box-left{
		display: flex;
		align-items: center;
	}
</style>
