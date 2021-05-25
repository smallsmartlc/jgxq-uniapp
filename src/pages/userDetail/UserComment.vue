<template>
	<scroll-view scroll-y style="width: 100%;height: 100%;" @scrolltolower="onreachBottom">
		<block v-for="(item,index) in comments" :key="item.id">
			<navigator :url="`${urls[item.type]}${item.objectId}`">
				<view class="comment-item">
					<view class="user">
						<view class="avatar">
							<u-avatar :src="$utils.url2img(user.headImage)" size="64"></u-avatar>
						</view>
						<view class="user-info">
							<view class="name">
								<view style="margin-right: 8rpx;">{{user.nickName}}</view>
								<view v-if="user.homeTeam">
									<u-image width="28" height="28" :src="$utils.url2img(user.homeTeam.logo)"
										mode="aspectFill"></u-image>
								</view>
							</view>
							<view class="time">
								<text>{{$utils.fromNowStr(item.createAt)}}</text>
								<text> · 回复{{item.type==0?'文章':'帖子'}}</text>
							</view>
						</view>
					</view>
					<view class="content u-line-1">
						<text>{{item.content}}</text>
					</view>
					<view class="replyBox">
						<text>[{{item.type==0?'资讯':'闲聊'}}]{{item.title}}</text>
					</view>
				</view>
			</navigator>
		</block>
		<u-loadmore :status="loadingStatus" :load-text="loadText" />
		<u-toast ref="uToast" />
	</scroll-view>
</template>

<script>
	import {pageUserComment} from '@/api/comment'
	export default {
		data() {
			return {
				comments: [],
				total: 1,
				cur: 0,
				pageSize: 10,
				loading: false,
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
		mounted() {
			this.load();
		},
		props: {
			user: Object,
		},
		methods: {
			onreachBottom() {
				this.load();
			},
			load() {
				if(this.disabled) return;
				this.loading = true
				this.cur++;
				pageUserComment({pageNum:this.cur,pageSize:this.pageSize,target : this.user.userkey})
				.then((res)=>{
					if(res.code == 200){
						var temp = res.data.records;
						this.total = res.data.total;
						this.comments = this.comments.concat(temp);
					}else{this.cur--;}
				})
				this.loading = false
			},
		},
		computed: {
			noMore() {
				return this.comments.length >= this.total
			},
			disabled() {
				return this.loading || this.noMore
			},
			loadingStatus(){
				return this.loading?'loading':this.noMore?'nomore':'loadmore'
			},
		},
	}
</script>

<style scoped>
	.comment-item{
		padding-top: 10rpx;
		padding: 20rpx;
		border-bottom: 4px solid #f7f7f7 ;
	}
	.user {
		display: flex;
		align-items: center;
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
	}
	
	.user-info .time {
		font-size: 8px;
		color: #666;
	}
	.replyBox{
		background-color: #f7f7f7;
		color: #666;
		padding: 10rpx;
		font-size: 10px;
		margin-bottom: 20rpx;
	}
</style>
