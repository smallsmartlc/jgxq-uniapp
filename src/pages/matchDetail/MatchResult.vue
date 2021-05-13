<template>
	<scroll-view scroll-y style="height: 100%;width: 100%;">
		<view class="match-news">
			<view class="title">战报</view>
			<view v-if="news" :data-id="news.id"  @click="toNewsDetail">
				<NewsBox :news="news"></NewsBox>
			</view>
			<view class="empty" v-else>
				<u-empty text="暂无战报" mode="news"></u-empty>
			</view>
		</view>
		<u-gap height="16" bg-color="#f7f7f7"></u-gap>
		<view class="actions">
			<view class="title">事件</view>
			<view class="action-wrap" v-if="action">
				<view class="content flex-center">
					<u-icon name="clock" size="40" color="#fc0"></u-icon>
					<view class="line-wrapper flex-center">
						<view class="dot"></view>
						<view class="line"></view>
						<view v-for="item in action" class="action-item">
							<view v-if="item.infoList.filter((e)=>e.home).length" class="float-wrapper">
								<view class="action-list float-left">
									<view v-for="home in item.infoList.filter((e)=>e.home)" class="action-detail align-right" :data-id="home.playerId" @click="toPlayerDetail">
										<view class="icon"><u-icon :name="actionType[home.type].icon" :color="actionType[home.type].color" custom-prefix="custom-icon"></u-icon></view>
										<view class="playerName">{{home.name}}</view>
									</view>
								</view>
							</view>
							<view class="flex-center">
								<view class="time-box">{{item.time}}</view>
								<view class="line"></view>
							</view>
							<view v-if="item.infoList.filter((e)=>!e.home).length" class="float-wrapper">
								<view class="action-list float-right">
									<view v-for="visit in item.infoList.filter((e)=>!e.home)" class="action-detail" :data-id="visit.playerId" @click="toPlayerDetail">
										<view class="icon"><u-icon :name="actionType[visit.type].icon" :color="actionType[visit.type].color" custom-prefix="custom-icon"></u-icon></view>
										<view class="playerName">{{visit.name}}</view>
									</view>
								</view>
							</view>
						</view>
						<view class="dot"></view>
					</view>
					<u-icon name="koushao" size="40" color="#fc0"  custom-prefix="custom-icon"></u-icon>
				</view>
			</view>
			<view class="empty" v-else>
				<u-empty text="暂无事件" mode="history"></u-empty>
			</view>
			<view class="description">
				<view v-for="type in actionType.slice(0,5)" :key="type.name">
					<u-icon :name="type.icon" :color="type.color"  custom-prefix="custom-icon"></u-icon>
					<text>{{type.name}}</text>
				</view>
			</view>
		</view>
		<u-gap height="16" bg-color="#f7f7f7"></u-gap>
	</scroll-view>
</template>

<script>
	import NewsBox from "@/components/NewsBox.vue"
	export default {
		components: {
			NewsBox
		},
		props: {
			news: Object,
			action: Array,
		},
		data() {
			return {
				actionType: [{
						name: "进球",
						color: "#000",
						icon: "zuqiu",
					},
					{
						name: "点球",
						color: "#fc0",
						icon: "zuqiu",
					},
					{
						name: "点球不进",
						color: "#FF0000",
						icon: "zuqiu",
					},
					{
						name: "乌龙球",
						color: "#FF00FF",
						icon: "zuqiu",
					},
					{
						name: "助攻",
						color: "#666",
						icon: "zhugong",
					},
					{
						name: "红牌",
						color: "#ea3443",
						icon: "red-card",
					},
					{
						name: "黄牌",
						color: "#fc0",
						icon: "red-card",
					},
					{
						name: "换上",
						color: "#fc0",
						icon: "shang",
					},
					{
						name: "换下",
						color: "#ea3443",
						icon: "xia",
					},
				],
			}
		},
		methods: {
			toPlayerDetail(e){
				let id = e.currentTarget.dataset.id;
				if(!id) return;
				uni.navigateTo({
					url: `../playerDetail/playerDetail?id=${id}`
				});
			},
			toNewsDetail(e){
				let id = e.currentTarget.dataset.id;
				if(!id) return;
				uni.navigateTo({
					url: `../newsDetail/newsDetail?id=${id}`
				});
			}
		},
		computed: {}
	}
</script>

<style scoped>
	.title {
		padding: 20rpx 20rpx;
		border-bottom: 2px solid #f7f7f7;
	}

	.empty {
		padding: 40rpx 0;
	}

	.action-wrap {
		width: 750rpx;
		display: flex;
		justify-content: center;
		padding: 20rpx;
		border-bottom: 2px solid #f7f7f7;
	}

	.flex-center {
		display: flex;
		flex-direction: column;
		align-items: center;
		height: auto;
		margin: 0 20rpx;
	}

	.content {
		width: 40rpx;
	}

	.line-wrapper {
		margin : 8rpx 0;
	}

	.line {
		height: 100%;
		min-height: 40rpx;
		width: 3px;
		background-color: #fc0;
	}

	.dot {
		min-width: 10px;
		min-height: 10px;
		border-radius: 50%;
		background-color: #fc0;
	}

	.action-item {
		display: flex;
		justify-content: center;
	}

	.time-box {
		font-size: 10px;
		color: #fff;
		background-color: #fc0;
		border-radius: 50%;
		min-height: 20px;
		min-width: 20px;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.float-wrapper {
		width: 0;
	}

	.float-right {
		align-items : flex-start;
	}

	.float-left {
		margin-left: -300rpx;
		align-items : flex-end;
	}

	.action-list {
		width: 300rpx;
		padding: 20rpx;
		border: 2px solid #f2f2f2;
		border-radius: 4px;
		margin-bottom: 30rpx;
		padding: 10rpx 20rpx;
		display: flex;
		flex-direction: column;
	}
	.action-detail{
		display: flex;
		width: auto;
		margin: 2rpx 0;
	}
	.align-right{
		flex-direction: row-reverse;
	}
	.icon{
		width: 28rpx;
		height: 28rpx;
	}
	.playerName{
		text-overflow: ellipsis;
		white-space: nowrap;
		margin: 0 12rpx;
	}
	.description{
		display: flex;
		justify-content: space-around;
		font-size: 12px;
		padding: 20rpx 0;
	}
</style>
