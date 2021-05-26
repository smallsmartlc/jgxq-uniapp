<template>
	<view class="wrap">
		<view v-for="item in messages" :key="item.id" class="message-item">
			<view class="user">
				<view class="avatar">
					<u-avatar :src="$utils.url2img(item.user.headImage)" size="64"></u-avatar>
				</view>
				<view class="user-info">
					<view class="name">
						<view style="margin-right: 8rpx;">{{item.user.nickName}}</view>
					</view>
					<view class="time">
						<text>{{$utils.fromNowStr(item.createAt)}}</text>
					</view>
				</view>
				<u-badge v-if="item.read" is-dot type="error" class="badge"></u-badge>
			</view>
			<view class="content">
				<text>{{item.text}}</text>
				<text>
					<navigator class="link" :url="`${urls[item.objectType]}${item.objectId}`">点击查看</navigator>
				</text>
			</view>
		</view>
		<u-loadmore @loadmore="load()" :status="loadingStatus" :load-text="loadText" />
	</view>
</template>

<script>
	import {pageMessage} from '@/api/user'
	export default {
		data() {
			return {
				loading: false,
				cur: 0,
				pageSize: 10,
				total: 1,
				messages: [],
				loadText : {
					loadmore: '加载更多',
					loading: '经管雄起正在加载',
					nomore: '没有更多了'
				},
				urls: [
					"../newsDetail/newsDetail?id=",
					"../talkDetail/talkDetail?id="
				]
			}
		},
		onLoad() {
			this.load();
		},
		methods: {
			load() {
				if(this.disabled) return;
				this.loading = true
				this.cur++;
				pageMessage(this.cur, this.pageSize)
					.then((res) => {
						if (res.code == 200) {
							var temp = res.data.records;
							this.total = res.data.total;
							this.messages = this.messages.concat(temp);
						} else {
							this.cur--;
						}
					})
				this.loading = false
			}
		},
		onPullDownRefresh() {
			this.messages = [],
			this.cur = 0,
			this.load();
			uni.stopPullDownRefresh();
		},
		onReachBottom() {
			this.load();
		},
		computed: {
			noMore() {
				return this.messages.length >= this.total
			},
			disabled() {
				var val = this.loading || this.noMore;
				return val;
			},
			loadingStatus() {
				return this.loading ? 'loading' : this.noMore ? 'nomore' : 'loadmore'
			},
		}
	}
</script>

<style scoped>
	.message-item{
		padding: 20rpx;
		border-bottom: 4px solid #f7f7f7;
	}
	.user {
		display: flex;
		align-items: center;
		position: relative;
	}
	.user-info {
		margin-left: 8rpx;
		display: flex;
		flex-direction: column;
	}
	.user-info .name {
		font-size: 14px;
		display: flex;
		align-items: center;
		color: #E6A23C;
	}
	
	.user-info .time {
		font-size: 8px;
		color: #666;
	}
	.content{
		display: flex;
	}
	.link{
		color: #E6A23C;
		margin-left: 8rpx;
	}
</style>
