<template>
	<view>
		<view class="main" v-if="news">
			<view class="news">
				<view class="title">{{news.title}}</view>
				<view class="author">
					<navigator v-if="news.author" :url="`/subPackages/userDetail/userDetail?userkey=${news.author.userkey}`">
						<text style="color: #fc0;margin-right: 16rpx;">{{news.author.nickName}}</text>
					</navigator>
					<text style="color: #666;">{{$utils.fromNowStr(news.createAt)}}</text>
				</view>
				<!-- <<view v-html="news.text"></view> -->
				<!-- <myParse  :content="news.text"></myParse> -->
				<u-parse :html="news.text" :tag-style="style" selectable lazy-load></u-parse>
				<view class="tags">
					<navigator v-for="(item,index) in news.tags" :key="index"
						:url="`../${tagType[item.type]}/${tagType[item.type]}?id=${item.objectId}`">
						<NewsTag :tag="item"></NewsTag>
					</navigator>
				</view>
				<view class="footer">
					<view class="button" @click="thumb">
						<u-icon :color="news && news.hit.thumb?'#fc0':'#000'" name="thumb-up" size="48"></u-icon>
						<text>{{news.hit.thumbs}}</text>
					</view>
					<view class="button" @click="collect">
						<u-icon :color="news && news.hit.collect?'#fc0':'#000'"
							:name="news && news.hit.collect?'star-fill':'star'" size="48"></u-icon>
						<text>{{news.hit.collects}}收藏</text>
					</view>
				</view>
			</view>
			<view class="related" v-if="newsList.length">
				<view class="header">
					<view class="devider"></view>
					<view>相关文章</view>
				</view>
				<view v-for="item in newsList" :key="item.id">
					<navigator :url="`/subPackages/newsDetail/newsDetail?id=${item.id}`">
						<NewsItem :news="item"></NewsItem>
					</navigator>
				</view>
			</view>
			<view class="comment" v-if="$utils.audit()">
				<view class="header">
					<view class="devider"></view>
					<view>评论<text v-if="news">({{news.hit.comments}})</text></view>
				</view>
				<view style="border-bottom: 1px solid #e7e7e7;" v-for="(item,index) in commentList" :key="item.id">
					<CommentItem @toast="showToast" @reply="replyComment(item)" @thumb="thumbComment(index)" @delete="deleteComment(index)" :comment="item"></CommentItem>
					<view class="view-more" @click="viewMore(item)" v-if="item.hits.comments">
						<text>共{{item.hits.comments}}条回复></text>
					</view>
				</view>
				<u-loadmore :status="loadingStatus" :load-text="loadText" />
			</view>
		</view>
		<view class="tabbar" v-if="$utils.audit()">
			<view class="comment-news" @click="toAddComment">发表你的评论</view>
			<view class="interact">
				<view @click="comment">
					<u-icon name="chat" size="48"></u-icon>
				</view>
				<view @click="thumb">
					<u-icon :color="news && news.hit.thumb?'#fc0':'#000'" name="thumb-up" size="48"></u-icon>
				</view>
				<view @click="collect">
					<u-icon :color="news && news.hit.collect?'#fc0':'#000'"
						:name="news && news.hit.collect?'star-fill':'star'" size="48"></u-icon>
				</view>
				<view>
					<u-icon color="#000" name="zhuanfa" size="48"></u-icon>
				</view>
			</view>
		</view>
		<u-toast ref="uToast" />
	</view>
</template>

<script>
	import {
		getNewsById,
		pageNewsByTags,
		pageComment
	} from '@/api/news'
	import {
		thumbById,
		collectById
	} from '@/api/hit'
	import NewsTag from '@/components/NewsTag.vue'
	import NewsItem from '@/components/NewsItem.vue'
	import CommentItem from '@/components/CommentItem.vue'
	export default {
		components: {
			NewsTag,
			NewsItem,
			CommentItem
		},
		data() {
			return {
				news: null,
				style: {
					// 字符串的形式
					video: 'width:700rpx;height : 350rpx',
					p: 'font-size: 14px;line-height:22px',
					iframe: 'width:700rpx;height : 350rpx',
					img: 'min-height:240rpx',
				},
				tagType: ["teamDetail", "playerDetail"],
				newsList: [],
				commentList: [],
				cur: 0,
				total: 1,
				pageSize: 10,
				loading: false,
				loadText: {
					loadmore: '加载更多',
					loading: '经管雄起正在加载',
					nomore: '没有更多了'
				},
			}
		},
		methods: {
			async getNewsById(id) {
				await getNewsById(id).then((res) => {
					if (res.code == 200) {
						this.news = res.data;
						// #ifdef MP
						this.news.text = this.$utils.iframe2Text(this.news.text);
						// #endif
						// this.setShare();
					}
				})
			},
			pageNewsByTags() {
				let tags = this.news.tags;
				if (!tags[0]) {
					return;
				}
				pageNewsByTags(1, 3, tags).then((res) => {
					if (res.code == 200) {
						var temp = res.data.records;
						this.newsList = temp;
					}
				})
			},
			loadingComment() {
				if (this.disabled) return;
				this.loading = true;
				this.cur++;
				pageComment(this.news.id, this.cur, this.pageSize).then((res) => {
					if (res.code == 200) {
						var temp = res.data.records;
						this.total = res.data.total
						this.commentList = this.commentList.concat(temp);
					} else {
						this.cur--
					};
					this.loading = false;
				})
			},
			viewMore(items) {
				uni.navigateTo({
					url: `/subPackages/reply/reply`,
					events: {
						// commentDataFromOpenerPage: function(data) {
						// 	console.log(data)
						// },
					},
					success: (res) => {
						res.eventChannel.emit("commentDataFromOpenerPage", {
							data: items
						})
					}
				})
			},
			thumb() {
				thumbById(0, this.news.id).then((res) => {
					if (res.code == 200) {
						if (res.data) {
							this.news.hit.thumb = true;
							this.news.hit.thumbs++;
						} else {
							this.$refs.uToast.show({
								title: '您已经赞过了',
								type: 'warning'
							});
						}
					}
				})
			},
			collect() {
				collectById(0, this.news.id, this.news.hit.collect).then((res) => {
					if (res.code == 200) {
						if (res.data == true) {
							var str = this.news.hit.collect ? "取消收藏成功" : "已添加到我的收藏";
							this.$refs.uToast.show({
								title: str,
								type: 'success'
							});
							this.news.hit.collect = !this.news.hit.collect;
							this.news.hit.collects += this.news.hit.collect ? 1 : -1;
						} else {
							var str = this.news.hit.collect ? "取消收藏失败" : "收藏失败"
							this.$message({
								message: str,
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
								type : 0,
								createAt : new Date(),
							}
							this.commentList.unshift(temp);
							this.total++;
						}
					},
					success: (res) => {
						if (!this.news) return;
						let req = {
							type: 0,
							objectId: this.news.id,
						};
						res.eventChannel.emit("openCommentBox", {
							data: req,
						})
					}
				})
			},
			replyComment(item){
				uni.navigateTo({
					url: "/subPackages/addComment/addComment",
					events: {
						successEvent: (data) => {
							item.hits.comments++;
						}
					},
					success: (res) => {
						if (!this.news) return;
						let req = {
							type: 0,
							objectId: this.news.id,
							parentId: item.id,
							target : item.userkey.userkey,
						};
						res.eventChannel.emit("openCommentBox", {
							data: req,
							user : item.userkey.nickName
						})
					}
				})
			},
			deleteComment(index){
				this.$refs.uToast.show({
					title: '已删除',
					type: 'success'
				});
				this.commentList.splice(index,1);
			},
			thumbComment(index){
				this.commentList[index].hits.thumb = true;
				this.commentList[index].hits.thumbs++;
			},
			showToast(data){
				this.$refs.uToast.show(data);
			}
		},
		onLoad(option) {
			this.getNewsById(option.id).then(()=>{
				if(this.news){
					this.pageNewsByTags();
					this.loadingComment();
				}	
			});
		},
		onReachBottom() {
			this.loadingComment();
		},
		onPullDownRefresh() {
			this.newsList = [];
			this.commentList = [];
			this.cur = 0;
			this.getNewsById(this.news.id).then(()=>{
				if(this.news){
					this.pageNewsByTags();
					this.loadingComment();
				}	
			});
			uni.stopPullDownRefresh();
		},
		onShareAppMessage(res) {
		    return {
		      title: this.news.title,
		      path: `/subPackages/newsDetail/newsDetail?id=${this.news.id}`,
			  imageUrl : this.$utils.url2img(this.news.cover)
		    }
		},
		computed: {
			noMore() {
				return this.commentList.length >= this.total
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

	.tabbar .comment-news {
		font-size: 10px;
		padding: 8rpx 16rpx;
		background-color: #ddd;
		color: #888;
		border-radius: 2px;
		width: 400rpx;
	}

	.tabbar .interact {
		display: flex;
		justify-content: space-evenly;
		width: 300rpx;
	}

	.main {
		padding-bottom: 80rpx;
		background-color: #FcFcFc;
	}

	.news {
		padding: 40rpx 30rpx;
		border-bottom: 4px solid #e7e7e7;
	}

	.news .title {
		font-size: 18px;
	}

	.news .author {
		font-size: 10px;
		margin: 20rpx 0;
		display: flex;
	}

	.news .tags {
		display: flex;
		margin-top: 24rpx;
	}

	.news .footer {
		display: flex;
		justify-content: space-around;
		margin-top: 60rpx;
	}

	.news .footer .button {
		border: 1px solid #e7e7e7;
		border-radius: 40rpx;
		height: 70rpx;
		width: 180rpx;
		align-items: center;
		display: flex;
		justify-content: center;
		font-size: 12px;
	}

	.button text {
		margin: 0 10rpx;
	}

	.related {
		font-size: 14px;
		border-bottom: 4px solid #e7e7e7;
	}

	.header {
		display: flex;
		padding: 8rpx;
		font-weight: bold;
	}

	.devider {
		width: 0px;
		border-left: 4px solid #fc0;
		margin-right: 8rpx;
	}

	.comment {}

	.view-more {
		margin: 0 16rpx;
		margin-bottom: 16rpx;
		font-size: 10px;
		display: flex;
	}

	.view-more text {
		color: #fc0;
		background-color: #f2f2f2;
		padding: 8rpx 12rpx;
		border-radius: 2px;
	}
</style>
