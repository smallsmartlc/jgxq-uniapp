<template>
	<view>
		<view class="main">
			<view class="news">
				<view class="title">{{news.title}}</view>
				<view class="author">
					<navigator v-if="news.author" :url="`../userDetail/userDetail?userkey=${news.author.userkey}`">
						<text style="color: #fc0;margin-right: 16rpx;">{{news.author.nickName}}</text>
					</navigator>
					<text style="color: #666;">{{$utils.fromNowStr(news.createAt)}}</text>
				</view>
				<u-parse :html="news.text" :tag-style="style"></u-parse>
			</view>
			<view class="related"></view>
			<view class="comment"></view>
		</view>
		<view class="tabbar">

		</view>
	</view>
</template>

<script>
	import {
		getNewsById
	} from '@/api/news'
	export default {
		data() {
			return {
				news: {},
				style: {
					// 字符串的形式
					video: 'width:700rpx;height : 350rpx',
					p : 'font-size: 14px;line-height:22px',
					iframe : 'width:700rpx;height : 350rpx'
				}
			}
		},
		methods: {
			getNewsById(id) {
				getNewsById(id).then((res) => {
					if (res.code == 200) {
						this.news = res.data;
						// this.setShare();
					}
				})
			},
		},
		onLoad(option) {
			this.getNewsById(option.id);
		},
	}
</script>

<style>
	.tabbar {
		height: 80rpx;
		width: 750rpx;
		background-color: red;
		position: fixed;
		bottom: 0;
	}

	.main {
		margin-bottom: 80rpx;
	}

	.news {
		padding: 40rpx 30rpx;
		margin-bottom: 4px solid #F2F2F2;
	}

	.news .title {
		font-size: 18px;
	}

	.news .author {
		font-size: 8px;
		margin: 20rpx 0;
		display: flex;
	}
</style>
