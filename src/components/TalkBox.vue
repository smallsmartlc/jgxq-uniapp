<template>
	<view class="talk-box">
		<view class="container">
			<view class="avatar">
				<navigator :url="`../userDetail/userDetail?userkey=${talk.author.userkey}`">
					<u-avatar :src="$utils.url2img(talk.author.headImage)" size="80"></u-avatar>
				</navigator>
			</view>
			<view class="content">
				<view class="info">
					<view>{{talk.author.nickName}}</view>
				</view>
				<view class="text">
					<u-read-more ref="uReadMore" :shadow-style="shadowStyle" close-text="查看全文" show-height="600"
						color="#fc0" text-indent="0">
						<view @click="toTalkDetail()">
							<u-parse :html="talk.text" :tag-style="style" @load="$refs.uReadMore.init()"></u-parse>
						</view>
					</u-read-more>
				</view>
				<view class="footer">
					<view class="time">{{$utils.fromNowStr(talk.createAt)}}</view>
					<view class="buttons">
						<view class="button">
							<u-icon @click="thumb" :color="talk.hit.thumb?'#fc0':'#000'" name="thumb-up"></u-icon>
						</view>
						<view class="button">
							<u-icon @click="openComment" name="chat"></u-icon>
						</view>
						<view class="button">
							<u-icon @click="actionSheet = true" name="more-dot-fill"></u-icon>
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
				<view v-show="commentBox" style="margin-bottom: 16rpx;">
					<u-search shape="square" search-icon="" clearabled action-text="发表" placeholder="评论" v-model="comment"
						:action-style="searchStyle" @custom="submitComment"></u-search>
				</view>
				<view class="comment-list" v-if="comments.length">
					<view v-for="(item,index) in comments" :key="item.id">
						<TalkComment @delete="deleteComment(index)" :comment="item"></TalkComment>
					</view>
				</view>
				<view v-if="talk.hit.comments>0 && !noMore" style="padding: 12rpx;">
					<u-loadmore @loadmore="loadComment" :status="loadingStatus" :load-text="loadText" />
				</view>
			</view>
		</view>
		<u-gap bg-color="#f7f7f7"></u-gap>
		<u-toast ref="uToast" />
		<u-action-sheet @click="clickContent" :list="list" v-model="actionSheet"></u-action-sheet>
	</view>
</template>

<script>
	import {
		thumbById
	} from '@/api/hit'
	import {commentObj} from '@/api/comment'
	import {pageMainComment,deleteTalk} from '@/api/talk'
	import TalkComment from './TalkComment.vue'
	export default {
		name: "TalkBox",
		components:{TalkComment},
		data() {
			return {
				comment: "",
				commentBox: false,
				comments : [],
				cur : 0,
				pageSize:10,
				total : 1,
				loading : false,
				actionSheet : false,
				
				style: {
					// 字符串的形式
					img: 'width:480rpx',
				},
				shadowStyle: {
					backgroundImage: "linear-gradient(-180deg, transparent 0%, #fff 80%)",
					paddingTop: "50rpx",
					marginTop: "-30rpx"
				},
				searchStyle: {
					backgroundColor: '#fc0',
					color: '#fff',
					padding: '6rpx 14rpx',
					borderRadius: "12rpx",
				},
			}
		},
		props: {
			talk: Object,
		},
		methods: {
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
							this.$emit('delete');
						}else{
							this.$emit("toast",{
								message: '删除失败,内容不存在',
								type: 'warning'
							});
						}
					}
				});
			},
			loadComment(){
				if(this.disabled){
					return;
				}
				this.loading = true;
				this.cur++;
				pageMainComment(this.talk.id,this.cur,this.pageSize).then((res)=>{
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
			toTalkDetail(){
				console.log("事件")
				uni.navigateTo({
				    url:`../talkDetail/talkDetail?id=${this.talk.id}`
				});
			},
			clickContent(index) {
				switch (this.list[index].text) {
					case '点赞':
						this.thumb();
						break;
					case '详情':
						this.toTalkDetail();
						break;
					case '删除':
						this.deleteTalk();
						break;
				}
			}
		},
		computed: {
			list() {
				var temp = [{
					text: '点赞',
				}, {
					text: '详情',
				}];
				var user = getApp().globalData.userInfo;
				if (user && this.talk.author.userkey === user.userkey) {
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
	.talk-box {
		width: 750rpx;
	}

	.container {
		display: flex;
		padding: 20rpx;
	}

	.avatar {
		margin-right: 20rpx;
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
	.comment-list{
		background-color: #f7f7f7;
		padding: 10rpx;
		display: flex;
		flex-direction: column;
	}
</style>
