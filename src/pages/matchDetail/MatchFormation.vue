<template>
	<scroll-view scroll-y style="height: 100%;width: 100%;">
		<view class="title">首发阵容</view>
		<view class="formation-wrap">
			<view class="bg-img">
				<u-image style="opacity: 0.3;" :src="require('@/static/playground.png')" width="750" height="1400"></u-image>
			</view>
			<view class="lineup-box">
				<view v-for="(item,index) in homeGroup" v-if="item" :key="'home'+index" class="line">
					<view class="player_container" v-for="(player,index2) in item" :key="`home${index}-${index2}`" @tap="toPlayerDetail(player.playerId)">
						<view class="player home">{{player.number}}</view>
						<view class="name">{{player.name}}</view>
					</view>
				</view>
			</view>
			<view class="lineup-box">
				<view v-for="(item,index) in visitingGroup" v-if="item" :key="'home'+index" class="line">
					<view class="player_container" v-for="(player,index2) in item" :key="`home${index}-${index2}`" @tap="toPlayerDetail(player.playerId)">
						<view class="player visiting">{{player.number}}</view>
						<view class="name">{{player.name}}</view>
					</view>
				</view>
			</view>
		</view>
		<view class="title">替补阵容</view>
		<view style="width:100%;display:flex;">
		    <view class="col">
		        <view class="row">主队</view>
		        <view v-for="(item,index) in info.homeSubstitute" :key="'home_sub'+index" class="row" @tap="toPlayerDetail(item.playerId)">
		            <view class="player home" style="margin-right:10rpx">{{item.number}}</view>
		            <view>
						<view>{{item.name}}</view>
						<view class="gray">{{position[item.matchPos]}}</view>
					</view>
		        </view>
		    </view>
		    <view class="col">
		        <view class="row">客队</view>
		        <view v-for="(item,index) in info.visitingSubstitute" :key="'visiting_sub'+index" class="row" @tap="toPlayerDetail(item.playerId)">
		            <view class="player visiting" style="margin-right:10rpx">{{item.number}}</view>
		            <view>
						<view>{{item.name}}</view>
						<view class="gray">{{position[item.matchPos]}}</view>
					</view>
		        </view>      
		    </view>
		</view>
	</scroll-view>
</template>

<script>
	export default {
		props: {
			info: Object,
		},
		data(){
			return {
				position:["门将","后卫","中场","前卫","前锋"]
			}
		},
		methods: {
			listToGroup(arr) {
				var newArr = [];
				if (!arr){return newArr};
				arr.forEach(e => {
					if (!newArr[e.matchPos]) {
						newArr[e.matchPos] = [];
					}
					newArr[e.matchPos].push(e);
				})
				return newArr;
			},
			toPlayerDetail(id){
				console.log(id);
				if(!id) return;
				uni.navigateTo({
					url: `../playerDetail/playerDetail?id=${id}`
				});
			}
		},
		computed: {
		    homeGroup(){
				return this.listToGroup(this.info.homeLineUp);
			},
			visitingGroup(){
				return this.listToGroup(this.info.visitingLineUp).reverse();
			}
		}
	}
</script>

<style scoped>
	.formation-wrap {
		width: 750rpx;
		height: 1400rpx;
	}

	.bg-img {
		position: absolute;
		z-index: -1;
		background-color: #18B566;
	}

	.lineup-box {
		width: 750rpx;
		height: 700rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: space-between;
		padding: 20rpx 0;
	}

	.line {
		width: 100%;
		display: flex;
		justify-content: space-around;
	}
	.player{
		width: 60rpx;
		height: 60rpx;
		color: #fff;
		font-size: 14px;
		border-radius: 50%;
		border: 2px solid white;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.home{
	    background-color: #fc0;
	}
	.visiting{
	    background-color: #007AFF;
	}
	
	.player_container{
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 60rpx;
	}
	.name{
		color: #fff;
		white-space: nowrap;
		font-size: 10px;
	}
	.title{
		background-color: #e7e7e7;
		padding: 8rpx 20rpx;
	}
	.row{
	    display: flex;
	    align-items: center;
	    padding: 20rpx;
	    border: 1px solid #E6E4DC;
	    font-size: 12px;
	}
	.col{
	    width:50%;
	}
	.gray{
		color : #999;
	}
</style>
