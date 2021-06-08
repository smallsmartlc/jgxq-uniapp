<template>
	<view class="container">
		<view class="header">
			<CommentItem @toast="showToast" @reply="toAddComment" :comment="comment"></CommentItem>
		</view>
		<view class="reply-container">
			<view class="box-header">
				<view class="devider"></view>
				<view>评论<text>({{total}})</text></view>
			</view>
			<view style="border-bottom: 1px solid #E7E7E7;" v-for="(item,index) in replys" :key="item.id">
				<CommentItem @toast="showToast" @delete="deleteReply(index)" @reply="replyReply(item)" :comment="item" reply></CommentItem>
				<view class="reply" v-if="item.reply">
					<view class="user-info">
						<text style="color: #fc0;margin-right: 4rpx;">{{item.reply.userkey.nickName}}</text>
						<view v-if="item.reply.userkey.homeTeam">
							<u-image width="24" height="24" :src="$utils.url2img(item.reply.userkey.homeTeam.logo)" mode="aspectFill"></u-image>
						</view>
					</view>
					<text>{{item.reply.content}}</text>
				</view>
			</view>
			<u-loadmore :status="loadingStatus" :load-text="loadText" />
		</view>
		<view class="tabbar">
			<view class="comment-upper" @click="toAddComment">回复楼主</view>
		</view>
		<u-toast ref="uToast" />
	</view>
</template>

<script>
	import CommentItem from '@/components/CommentItem.vue'
	import {
		pageReply
	} from '@/api/comment'
		export default {
			components: {
				CommentItem
			},
			data() {
				return {
					comment: null,
					replys: [],
					cur : 0,
					pageSize : 10,
					total : 1,
					loadText : {
						loadmore: '加载更多评论',
						loading: '经管雄起正在加载',
						nomore: '没有更多了'
					},
					
				}
			},
			methods: {
				loadingReply() {
					if(this.disabled) return; 
					this.cur++;
					pageReply(this.comment.id, this.cur, this.pageSize).then((res) => {
						if (res.code == 200) {
							var temp = res.data.records;
							this.total = res.data.total
							this.replys = this.replys.concat(temp);
						} else {
							this.cur--
						};
					})
				},
				toAddComment() {
					uni.navigateTo({
						url: "/subPackages/addComment/addComment",
						events: {
							successEvent: (data) => {
								let temp = {
									...data,
									userkey : getApp().globalData.userInfo,
									thumbs : 0,
									thumb : false,
									type : 0,
									createAt : new Date(),
								}
								this.replys.unshift(temp);
								this.total++;
							}
						},
						success: (res) => {
							if (!this.comment) return;
							let req = {
								type: 0,
								objectId: this.comment.objectId,
								parentId : this.comment.id,
								target : this.comment.userkey.userkey,
							};
							res.eventChannel.emit("openCommentBox", {
								data: req,
								user: this.comment.userkey.nickName
							})
						}
					})
				},
				replyReply(item){
					uni.navigateTo({
						url: "/subPackages/addComment/addComment",
						events: {
							successEvent: (data) => {
								// 回复对象
								let temp = {
									...data,
									userkey : getApp().globalData.userInfo,
									thumbs : 0,
									thumb : false,
									type : 0,
									createAt : new Date(),
									reply : item,
								}
								this.replys.unshift(temp);
							}
						},
						success: (res) => {
							let req = {
								type: 0,
								objectId: item.objectId,
								parentId: item.parentId,
								target : item.userkey.userkey,
								replyId : item.id
							};
							res.eventChannel.emit("openCommentBox", {
								data: req,
								user: item.userkey.nickName,
							})
						}
					})
				},
				deleteReply(index){
					this.$refs.uToast.show({
						title: '已删除',
						type: 'success'
					});
					this.replys.splice(index,1);
				},
				showToast(data){
					this.$refs.uToast.show(data);
				}
			},
			onLoad(option) {
				const eventChannel = this.getOpenerEventChannel();
				eventChannel.on('commentDataFromOpenerPage', (data) => {
					this.comment = data.data;
					this.loadingReply();
				})
			},
			onReachBottom() {
				this.loadingReply();
			},
			onPullDownRefresh(){
				this.replys = [];
				this.cur = 0;
				this.loadingReply();
				uni.stopPullDownRefresh();
			},
			computed:{
				noMore() {
					return this.replys.length >= this.total
				},
				disabled() {
					var val = this.loading || this.noMore;
					return val;
				},
				loadingStatus(){
					return this.loading?'loading':this.noMore?'nomore':'loadmore'
				},
			}
		}
</script>

<style scoped>
	.container {
		background-color: #FcFcFc;
	}

	.header {
		border-bottom: 4px solid #e7e7e7;
	}

	.box-header {
		display: flex;
		padding: 8rpx;
	}

	.devider {
		width: 0px;
		border-left: 4px solid #fc0;
		margin-right: 8rpx;
	}
	.reply-container{
		padding-bottom: 80rpx;
	}
	.reply {
		margin: 0 16rpx;
		margin-bottom: 16rpx;
		padding: 16rpx;
		background-color: #f2f2f2;
		color: #666;
		font-size: 12px;
	}
	.user-info{
		display: flex;
		align-items: center;
		margin-bottom: 8rpx;
	}
	.tabbar {
		height: 80rpx;
		width: 750rpx;
		background-color: #fff;
		position: fixed;
		bottom: 0;
		box-shadow: 0 0 4px #d7d7d7;
		display: flex;
		align-items: center;
		padding: 0 16rpx;
		justify-content: space-between;
		z-index: 1000;
	}
	.tabbar .comment-upper{
		font-size: 10px;
		padding: 8rpx 16rpx;
		background-color: #ddd;
		color: #888;
		border-radius: 2px;
		width: 100%;
	}
</style>
