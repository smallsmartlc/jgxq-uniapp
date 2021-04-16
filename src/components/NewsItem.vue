<template>
	<view>
		<view class="news-box">
			<view class="img-box" style="color:#666660">
				<u-image width="140" height="100%"
					:src="$utils.url2img(news.cover)"
					mode="aspectFill"></u-image>
			</view>
			<view class="title-box">
				<view class="title">{{news.title}}</view>
				<view>
					<block v-if="news.comments!=null">
						<u-icon name="chat" size="36"></u-icon>
						<span>{{news.comments>999?"999+":news.comments}}</span>
					</block>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name:"NewsItem",
		data() {
			return {
				
			};
		},
		props:{
			news : Object,
		},
	}
</script>

<style scoped>
.news-box{
	width: 750rpx;
	height: 140rpx;
	padding: 24rpx;
	display: flex;
	border-bottom: 1px solid #e7e7e7;
}
.title{
	font-size: 16px;
	display: -webkit-box;
	-webkit-box-orient: vertical;   /*排列方式*/ 
	-webkit-line-clamp: 2;/*显示文本行数*/
	overflow: hidden;/*溢出隐藏*/
	
}
.title-box{
	margin-left: 16rpx;
	font-size: 14px;
	display:flex;
	flex-direction:column;
	justify-content:space-between;
}
</style>
