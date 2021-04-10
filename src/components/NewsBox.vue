<template>
	<view>
		<view class="news-box">
			<view class="title-box">
				<view class="title">{{news.title}}</view>
				<view style="">
					<text v-if="top" style="font-size: 12px;color: #fc0;margin-right:4px;">置顶</text>
					<u-icon name="chat" size="36"></u-icon>
					<span>{{news.comments>999?"999+":news.comments}}</span>
				</view>
			</view>
			<view class="img-box" v-if="news.comments!=null" style="color:#666660">
				<u-image style="width: 170rpx;height: 100%;"
					:src="$utils.url2img(news.cover)"
					mode="aspectFill"></u-image>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name:"NewsBox",
		data() {
			return {
				
			};
		},
		props:{
			news : Object,
			top : Boolean,
		},
	}
</script>

<style scoped>
.news-box{
	width: 750rpx;
	height: 200rpx;
	padding: 12px;
	display: flex;
	justify-content: space-between;
	border-bottom: 1px solid #f2f2f2;
}
.title{
	font-size: 16px;
	display: -webkit-box;
	-webkit-box-orient: vertical;   /*排列方式*/ 
	-webkit-line-clamp: 2;/*显示文本行数*/
	overflow: hidden;/*溢出隐藏*/
	
}
.title-box{
	margin-right: 24rpx;
	font-size: 14px;
	display:flex;
	flex-direction:column;
	justify-content:space-between;
}
</style>
