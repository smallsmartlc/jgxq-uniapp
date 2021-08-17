<template>
	<view class="wrap" v-if="talk">
		<view class="container">
			<view class="avatar">
				<navigator :url="`/subPackages/userDetail/userDetail?userkey=${talk.author.userkey}`">
					<u-avatar :src="$utils.url2img(talk.author.headImage)" size="80"></u-avatar>
				</navigator>
			</view>
			<view class="content">
				<view class="info">
					<view>{{talk.author.nickName}}</view>
				</view>
				<view class="text">
					<view>
						<u-parse :html="talk.text" :tag-style="style"></u-parse>
					</view>
				</view>
				<view class="footer">
					<view class="time">{{$utils.fromNowStr(talk.createAt)}}</view>
					<view class="buttons">
						<view class="button">
							<u-icon @click="thumb" :color="talk.hit.thumb?'#fc0':'#000'" name="thumb-up"></u-icon>
						</view>
						<view class="button" v-if="$utils.audit()">
							<u-icon @click="toAddComment()" name="chat"></u-icon>
						</view>
						<view class="button">
							<u-icon @click="actionSheet = true" name="more-dot-fill"></u-icon>
						</view>
					</view>
				</view>
			</view>
		</view>
		<u-line margin="20rpx 0"></u-line>
		<view class="talk-hit">
			<view v-if="talk.hit.thumbs">
				<u-icon color="#E6A23C" name="thumb-up-fill"></u-icon>
				<text>{{talk.hit.thumbs}}人觉得很赞</text>
			</view>
		</view>
		<view class="comment-wrap">
			<block v-for="(item,index) in comments" :key="item.id">
				<CommentBox :comment="item" @toast="showToast" @thumb="thumbComment(index)" @delete="deleteComment(index)"></CommentBox>
			</block>
		</view>
		<view class="tabbar">
			<view class="comment-talk" @click="toAddComment">发表你的评论</view>
			<view class="interact">
				<view @click="thumb">
					<u-icon :color="talk && talk.hit.thumb?'#fc0':'#000'" name="thumb-up" size="48"></u-icon>
				</view>
				<view>
					<u-icon color="#000" name="zhuanfa" size="48"></u-icon>
				</view>
			</view>
		</view>
		<u-toast ref="uToast" />
		<u-action-sheet @click="clickContent" :list="list" v-model="actionSheet"></u-action-sheet>
	</view>
</template>

<script>
	import {pageComment,deleteTalk,getTalkById} from '@/api/talk'
	import CommentBox from '@/components/CommentBox.vue'
	import {
		thumbById
	} from '@/api/hit'
	export default {
		components:{CommentBox},
		data() {
			return {
				talk : null,
				style: {
					// 字符串的形式
					img: 'width:480rpx',
				},
				actionSheet : false,
				comments : [],
				cur : 0,
				pageSize:10,
				total : 1,
				loading : false,
			}
		},
		methods: {
			async loadTalk(id){
				await getTalkById(id).then((res)=>{
					if(res.code == 200){
						this.talk = res.data;
					}
				})
			},
			thumb() {
				thumbById(1, this.talk.id).then((res) => {
					if (res.code == 200) {
						if (res.data) {
							this.talk.hit.thumb = true;
							this.talk.hit.thumbs++;
						} else {
							this.$emit("toast",{
								title: '您已经赞过了',
								type: 'warning'
							});
						}
					}
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
								hits: {
									"thumbs": 0,
									"comments": 0,
									"thumb": false
								},
								type : 1,
								createAt : new Date(),
							}
							this.comments.unshift(temp);
							this.total++;
						}
					},
					success: (res) => {
						if (!this.talk) return;
						let req = {
							type: 1,
							objectId: this.talk.id,
						};
						res.eventChannel.emit("openCommentBox", {
							data: req,
						})
					}
				})
			},
			openComment() {
				this.commentBox = !this.commentBox;
			},
			submitComment() {
				if (this.comment.length < 1) {
					this.$emit("toast",{
						title: '评论不能为空',
						type: 'warning'
					});
				}
				var commentReq = {
					type: 1,
					objectId: this.talk.id,
					content: this.comment,
					target: this.talk.author.userkey,
				}
				commentObj(commentReq).then((res) => {
					if (res.code == 200) {
						var temp = {
							id: res.data,
							userkey: getApp().globalData.userInfo,
							"hits": {
								"thumbs": 0,
								"comments": 0,
								"thumb": false
							},
							objectId: commentReq.objectId,
							type: commentReq.type,
							"content": commentReq.content,
							"createAt": new Date(),
						}
						this.comment = "";
						this.$emit("toast",{
							title: '评论成功',
							type: 'success'
						});
						this.comments.unshift(temp);
						this.total++;
						this.talk.hit.comments++;
						this.commentBox = false;
					}
				})
			},
			deleteTalk(){
				deleteTalk(this.talk.id).then((res)=>{
					if(res.code==200){
						if(res.data==true){
							this.$refs.uToast.show({
								title: '删除成功',
								type: 'warning'
							});
							uni.navigateBack();
						}else{
							this.$refs.uToast.show({
								title: '删除失败,内容不存在',
								type: 'warning'
							});
						}
					}
				});
			},
			loadComment(id){
				if(this.disabled){
					return;
				}
				this.loading = true;
				this.cur++;
				pageComment(this.talk.id,this.cur,this.pageSize).then((res)=>{
					if(res.code == 200){
					var temp = res.data.records;
					this.total = res.data.total
					this.comments = this.comments.concat(temp);
					}else this.cur--;
					this.loading = false;
				})
			},
			deleteComment(index){
				this.total--;
				this.comments.splice(index,1);
			},
			thumbComment(index){
				this.comments[index].hits.thumb = true;
				this.comments[index].hits.thumbs++;
			},
			clickContent(index) {
				switch (this.list[index].text) {
					case '点赞':
						this.thumb();
						break;
					case '删除':
						this.deleteTalk();
						break;
				}
			},
			showToast(data){
				this.$refs.uToast.show(data);
			}
		},
		onLoad(option) {
			this.loadTalk(option.id).then(()=>{
				if(this.talk){
					this.loadComment();
				}
			});
		},
		onShareAppMessage(res) {
		    return {
		      path: `/subPackages/talkDetail/talkDetail?id=${this.match.id}`
		    }
		},
		computed: {
			list() {
				var temp = [{
					text: '点赞',
				}];
				var user = getApp().globalData.userInfo;
				if (user && this.talk && this.talk.author.userkey === user.userkey) {
					temp.push({
						text: '删除'
					});
				}
				return temp;
			},
			
			loadText() {
				var temp = {
					loadmore: this.cur > 0 ?'加载更多评论':'点击加载评论',
					loading: '经管雄起正在加载',
					nomore: '没有更多了',
				}
				return temp;
			},
			noMore() {
				return this.comments.length >= this.total
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
	.wrap{
		padding: 20rpx;
	}
	.avatar {
		margin-right: 20rpx;
	}
	.container {
		display: flex;
	}
	.content .info {
		color: #E6A23C;
		margin-bottom: 12rpx;
		font-weight: 400;
		width: 600rpx;
	}
	
	.content .text {}
	
	.footer {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	
	.footer .time {
		color: #999;
		font-size: 10px;
	}
	
	.footer .buttons {
		display: flex;
	}
	
	.footer .button {
		position: relative;
		font-size: 24px;
		margin-right: 20rpx;
	}
	.talk-hit {
		font-size: 10px;
		line-height: 20px;
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
	
	.tabbar .comment-talk {
		font-size: 10px;
		padding: 8rpx 16rpx;
		background-color: #ddd;
		color: #888;
		border-radius: 2px;
		width: 500rpx;
	}
	
	.tabbar .interact {
		display: flex;
		justify-content: space-evenly;
		width: 200rpx;
	}
</style>
