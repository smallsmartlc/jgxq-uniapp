<template>
	<view v-if="comment" class="c-wrap">
		<view class="avatar">
			<navigator :url="`../userDetail/userDetail?userkey=${comment.userkey.userkey}`">
				<u-avatar :src="$utils.url2img(comment.userkey.headImage)" size="64"></u-avatar>
			</navigator>
		</view>
		<view class="content">
			<view class="main-comment">
				<view class="user-info">
					<navigator :url="`../userDetail/userDetail?userkey=${comment.userkey.userkey}`">
						<view class="name">
							<view style="margin-right: 8rpx;">{{comment.userkey.nickName}}</view>
							<view v-if="comment.userkey.homeTeam">
								<u-image width="28" height="28" :src="$utils.url2img(comment.userkey.homeTeam.logo)"
									mode="aspectFill"></u-image>
							</view>
						</view>
					</navigator>
					<view class="comment-con" @click="show = true"><text>{{comment.content}}</text></view>
					<view class="time">{{$utils.fromNowStr(comment.createAt)}}</view>
				</view>
				<view class="thumb">
					<u-icon @click="thumb" :color="comment.hits.thumb?'#fc0':'#000'" name="thumb-up" size="36"></u-icon>
					<text v-if="comment.hits.thumbs" style="color: #666;font-size: 12px;">{{comment.hits.thumbs}}</text>
				</view>
			</view>
			<view class="replys">
				<block v-for="item in replys" :key="item.id">
					<ReplyBox :reply="item" @toast="(data)=>$emit('toast',data)" @delete="deleteReply"></ReplyBox>
				</block>
			</view>
			<u-action-sheet @click="clickContent" :list="list" v-model="show"></u-action-sheet>
			<u-loadmore v-if="comment.hits.comments" @loadmore="loadReply" :status="loadingStatus" :load-text="loadText" />
		</view>
	</view>
</template>

<script>
	import {
		thumbById
	} from '@/api/hit'
	import {deleteTalk} from '@/api/talk'
	import {pageReply,deleteComment} from '@/api/comment'
	import ReplyBox from './ReplyBox.vue'
	export default {
		components:{ReplyBox},
		data() {
			return {
				replys : [],
				cur : 0,
				pageSize:10,
				total : 1,
				show: false,
			}
		},
		props: {
			comment : Object,
		},
		methods:{
			thumb(){
				thumbById(2, this.comment.id).then((res) => {
					if (res.code == 200) {
						if (res.data) {
							if (this.reply) {
								this.comment.thumb = true;
								this.comment.thumbs++;
							} else {
								this.comment.hits.thumb = true;
								this.comment.hits.thumbs++;
							}
						} else {
							this.$emit("toast",{
								title: '您已经赞过了',
								type: 'warning'
							});
						}
					}
				})
			},
			loadReply(){
				if(this.disabled) return;
				this.cur++;
				pageReply(this.comment.id,this.cur,this.pageSize).then((res)=>{
					if(res.code == 200){
						var temp = res.data.records;
						this.total = res.data.total
						this.replys = this.replys.concat(temp);
					}else{this.cur--};
				})
			},
			clickContent(index) {
				switch (this.list[index].text) {
					case '点赞':
						this.thumb();
						break;
					case '回复':
						this.replyComment();
						break;
					case '删除':
						this.deleteComment();
						break;
				}
			},
			replyComment() {
				uni.navigateTo({
					url: "../addComment/addComment",
					events: {
						successEvent: (data) => {
							let temp = {
								...data,
								userkey : getApp().globalData.userInfo,
								thumbs : 0,
								thumb : false,
								type : 1,
								createAt : new Date(),
							}
							this.replys.unshift(temp);
						}
					},
					success: (res) => {
						let req = {
							type: 1,
							objectId: this.comment.objectId,
							parentId: this.comment.id,
							target : this.comment.userkey.userkey,
						};
						res.eventChannel.emit("openCommentBox", {
							data: req,
							user: this.comment.userkey.nickName,
						})
					}
				})
			},
			deleteComment() {
				deleteComment(this.comment.id).then((res) => {
					if (res.code == 200) {
						if (res.data == true) {
							this.$emit('delete');
						} else {
							this.$emit("toast",{
								title: '删除失败,评论不存在',
								type: 'warning'
							});
						}
					}
				})
			},
		},
		computed:{
			loadText() {
				var temp = {
					loadmore: this.cur > 0 ?'加载更多回复':'点击加载回复',
					loading: '经管雄起正在加载',
					nomore: '没有更多了',
				}
				return temp;
			},
			noMore() {
				return this.replys.length >= this.total
			},
			disabled() {
				var val = this.loading || this.noMore;
				return val;
			},
			loadingStatus() {
				return this.loading ? 'loading' : this.noMore ? 'nomore' : 'loadmore'
			},
			list() {
				var temp = [{
					text: '点赞',
				}, {
					text: '回复',
				}];
				var user = getApp().globalData.userInfo;
				if (user && this.comment.userkey.userkey === user.userkey) {
					temp.push({
						text: '删除'
					});
				}
				return temp;
			}
		}
	}
</script>

<style scoped>
	.c-wrap{
		display: flex;
		padding-top: 10rpx;
	}
	.content{
		width: 100%;
		padding-bottom: 10rpx;
		border-bottom: 1px solid #f7f7f7;
	}
	.main-comment{
		display: flex;
		justify-content: space-between;
	}
	.user-info {
		margin-left: 8rpx;
		display: flex;
		flex-direction: column;
	}
	
	.user-info .name{
		color: #E6A23C;
		display: flex;
		align-items: center;
	}
	.user-info .time {
		font-size: 10px;
		color: #666;
	}
	.comment-con {
		font-size: 14px;
		margin: 8rpx 0;
	}
</style>
