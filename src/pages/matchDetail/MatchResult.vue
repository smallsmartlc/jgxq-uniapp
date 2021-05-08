<template>
	<scroll-view scroll-y style="height: 100%;width: 100%;">
		<view class="match-news">
			<view class="title">战报</view>
			<view v-if="news">
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
						<view v-for="item in action" class="action-item flex-center">
							<view class="time-box">{{item.time}}</view>
							<view class="line"></view>
							<view class="float-wrapper">
								<view class="action-list"></view>
							</view>
						</view>
					</view>
				</view>
			</view>
			<view class="empty" v-else>
				<u-empty text="暂无事件" mode="history"></u-empty>
			</view>
		</view>
	</scroll-view>
</template>

<script>
	import NewsBox from "@/components/NewsBox.vue"
	export default {
		components:{NewsBox},
		props: {
			news: Object,
			action : Array,
		},
		data(){
			return {
				
			}
		},
		methods: {
			
		},
		computed: {
		}
	}
</script>

<style scoped>
	.title{
		padding: 20rpx 20rpx;
		border-bottom: 2px solid #f7f7f7;
	}
	.empty{
		padding: 40rpx 0;
	}
	.action-wrap{
		width: 750rpx;
		display: flex;
		justify-content: center;
		padding: 20rpx;
	}
	.flex-center{
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	.content{
		width: 40rpx;
	}
	.line-wrapper{
	}
	.line{
		height: 100%;
		min-height: 40rpx;
		width: 3px;
		background-color: #fc0;
	}
	.dot{
		min-width: 10px;
		min-height: 10px;
		border-radius: 50%;
		background-color: #fc0;
	}
	.action-item{
		position: relative;
	}
	.time-box{
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
	.float-wrapper{
		width: 0;
		height: 0;
		position: absolute;
		top: 0;
		left : 20px;
	}
	.action-list{
		width: 100px;
		height: 60px;
		background-color: #fc0;
	}
</style>
