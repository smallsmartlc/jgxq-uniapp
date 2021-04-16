<template>
	<view>
		<view class="main" v-if="news">
			<view class="news">
				<view class="title">{{news.title}}</view>
				<view class="author">
					<navigator v-if="news.author" :url="`../userDetail/userDetail?userkey=${news.author.userkey}`">
						<text style="color: #fc0;margin-right: 16rpx;">{{news.author.nickName}}</text>
					</navigator>
					<text style="color: #666;">{{$utils.fromNowStr(news.createAt)}}</text>
				</view>
				<!-- <<view v-html="news.text"></view> -->
				<!-- <myParse  :content="news.text"></myParse> -->
				<u-parse :html="news.text" :tag-style="style"></u-parse>
				<view class="tags">
					<navigator  v-for="(item,index) in news.tags" :key="index" 
					:url="`../${tagType[item.type]}/${tagType[item.type]}?id=${item.id}`">
						<NewsTag :tag="item"></NewsTag>
					</navigator>
				</view>
			</view>
			<view class="related" v-if="newsList.length">
				<view class="header"style="font-weight: bold;">
					<view class="devider"></view>
					<view>相关文章</view>
				</view>
				<view v-for="item in newsList" :key="item.id">
					<NewsItem :news="item"></NewsItem>
				</view>
			</view>
			<view class="comment">
				<view class="header"style="font-weight: bold;">
					<view class="devider"></view>
					<view>评论<text v-if="news">({{news.hit.comments}})</text></view>
				</view>
				<view style="border-bottom: 1px solid #e7e7e7;" v-for="item in commentList" :key="item.id">
					<CommentItem :comment="item"></CommentItem>
					<view class="view-more" @click="viewMore(item)" v-if="item.hits.comments">
						<text>共{{item.hits.comments}}条回复></text>
					</view>
				</view>
				<u-loadmore :status="loadingStatus" :load-text="loadText" />
			</view>
		</view>
		<view class="tabbar">
			<view class="comment-news">发表你的评论</view>
			<view class="interact">
				<view @click="thumb">
					<u-icon :color="news && news.hit.thumb?'#fc0':'#000'" name="thumb-up" size="48"></u-icon>
				</view>
				<view @click="collect">
					<u-icon :color="news && news.hit.collect?'#fc0':'#000'" :name="news && news.hit.collect?'star-fill':'star'" size="48"></u-icon>
				</view>
				<view>
					<u-icon color="#000" name="zhuanfa" size="48"></u-icon>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		getNewsById,pageNewsByTags,pageComment
	} from '@/api/news'
	import NewsTag from '@/components/NewsTag.vue'
	import NewsItem from '@/components/NewsItem.vue'
	import CommentItem from '@/components/CommentItem.vue'
	export default {
		components:{NewsTag,NewsItem,CommentItem},
		data() {
			return {
				news: null,
				style: {
					// 字符串的形式
					video: 'width:700rpx;height : 350rpx',
					p : 'font-size: 14px;line-height:22px',
					iframe : 'width:700rpx;height : 350rpx'
				},
				tagType: ["teamDetail","playerDetail"],
				newsList : [],
				commentList : [],
				cur : 0,
				total : 1,
				pageSize : 10,
				loading : false,
				loadText : {
					loadmore: '加载更多',
					loading: '经管雄起正在加载',
					nomore: '没有更多了'
				},
			}
		},
		methods: {
			getNewsById(id) {
				getNewsById(id).then((res) => {
					if (res.code == 200) {
						this.news = res.data;
						// #ifdef MP
							this.news.text = this.$utils.iframe2Text(this.news.text);
						// #endif
						// this.setShare();
						this.pageNewsByTags();
						this.loadingComment();
					}
				})
			},
			pageNewsByTags(){
				let tags = this.news.tags;
				if(!tags[0]){
					return ;
				}
				pageNewsByTags(1,3,tags).then((res)=>{
					if(res.code == 200){
						var temp = res.data.records;
						this.newsList = temp;
					}
				})
			},
			loadingComment(){
				if(this.disabled) return;
				this.loading = true;
				this.cur++;
				pageComment(this.news.id,this.cur,this.pageSize).then((res)=>{
					if(res.code == 200){
						var temp = res.data.records;
						this.total = res.data.total
						this.commentList = this.commentList.concat(temp);
					}else{this.cur--};
					this.loading = false;
				})
			},
			viewMore(items){
				uni.navigateTo({
					url:`../reply/reply`
				})
			}
		},
		onLoad(option) {
			this.getNewsById(option.id);
		},
		onReachBottom() {
			this.loadingComment();
		},
		onPullDownRefresh(){
			this.newsList = [];
			this.commentList = [];
			this.cur = 0;
			this.getNewsById(this.news.id)
			uni.stopPullDownRefresh();
		},
		computed:{
			noMore() {
				return this.commentList.length >= this.total
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
	}
	.tabbar .comment-news{
		font-size: 10px;
		padding: 8rpx 16rpx;
		background-color: #ddd;
		color: #888;
		border-radius: 2px;
		width: 400rpx;
	}
	.tabbar .interact{
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
		font-size: 8px;
		margin: 20rpx 0;
		display: flex;
	}
	.news .tags {
		display: flex;
		margin-top: 24rpx;
	}
	.related {
		font-size: 14px;
		border-bottom: 4px solid #e7e7e7;
	}
	.header{
		display: flex;
		padding: 8rpx;
	} 
	.devider{
		width: 0px;
		border-left: 4px solid #fc0;
		margin-right: 8rpx;
	}
	.comment{
	}
	.view-more{
		margin: 0 16rpx;	
		margin-bottom: 16rpx;
		font-size: 10px;
		display: flex;
	}
	.view-more text{
		color: #fc0;
		background-color: #f2f2f2;
		padding:8rpx 12rpx;
		border-radius: 2px;
	}
</style>
