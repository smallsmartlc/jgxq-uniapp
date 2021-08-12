<template>
	<view v-if="reply" class="r-wrap">
		<view class="avatar">
			<navigator :url="`/subPackages/userDetail/userDetail?userkey=${reply.userkey.userkey}`">
				<u-avatar :src="$utils.url2img(reply.userkey.headImage)" size="64"></u-avatar>
			</navigator>
		</view>
		<view class="content">
			<view class="main-reply">
				<view class="user-info">
					<navigator :url="`/subPackages/userDetail/userDetail?userkey=${reply.userkey.userkey}`">
						<view class="name">
							<view style="margin-right: 8rpx;">{{reply.userkey.nickName}}</view>
							<view v-if="reply.userkey.homeTeam">
								<u-image width="28" height="28" :src="$utils.url2img(reply.userkey.homeTeam.logo)"
									mode="aspectFill"></u-image>
							</view>
						</view>
					</navigator>
					<view class="reply-con">
						<block v-if="reply.reply">
							<text>回复</text>
							<view class="name">
								<navigator :url="`/subPackages/userDetail/userDetail?userkey=${reply.reply.userkey}`">{{reply.reply.userkey.nickName}}</navigator>
							</view>
							<text>：</text>
						</block>
						<text @click="show=true">{{reply.content}}</text>
					</view>
					<view class="time">{{$utils.fromNowStr(reply.createAt)}}</view>
				</view>
				<view class="thumb">
					<u-icon @click="thumb" :color="reply.thumb?'#fc0':'#000'" name="thumb-up" size="36"></u-icon>
					<text v-if="reply.thumbs" style="color: #666;font-size: 12px;">{{reply.thumbs}}</text>
				</view>
			</view>
		</view>
		<u-action-sheet @click="clickContent" :list="list" v-model="show"></u-action-sheet>
	</view>
</template>

<script>
	import {thumbById} from '@/api/hit'
	import {deleteComment}  from '@/api/comment'
	export default {
		name:"ReplyBox",
		data() {
			return {
				show : false,
			};
		},
		props:{
			reply: Object
		},
		methods:{
			thumb(){
				thumbById(2,this.reply.id).then((res)=>{
					if(res.code == 200){
						if(res.data){
							this.$emit("thumb");
						}else{
							this.$emit("toast",{
								title: '您已经赞过了',
								type: 'warning'
							});
						}
					}
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
						this.deleteItem();
						break;
				}
			},
			deleteItem(){
				deleteComment(this.reply.id).then((res)=>{
					if(res.code == 200){
						if(res.data==true){
							uni.showToast({
								title: '已删除',
							});
							this.$emit('delete');
						}
					}
				})
			},
			replyComment(){
				uni.navigateTo({
					url: "/subPackages/addComment/addComment",
					events: {
						successEvent: (data) => {
							var temp = {
								...data,
								reply : this.reply.userkey,
								userkey : getApp().globalData.userInfo
							}
							this.$emit("reply",temp);
						}
					},
					success: (res) => {
						if (!this.reply) return;
						var req = {};
						if(this.reply.reply){
							req = {
								type: 1,
								objectId: this.reply.objectId,
								parentId: this.reply.parentId,
								replyId : this.reply.id,
								target : this.reply.userkey.userkey,
							}
						}else{
							req = {
								type: 1,
								objectId: this.reply.objectId,
								parentId: this.reply.id,
								target : this.reply.userkey.userkey,
							}
						}
						res.eventChannel.emit("openCommentBox", {
							data: req,
							user : this.reply.userkey.nickName
						})
					}
				})
			},
		},
		computed:{
			list() {
				var temp = [{
					text: '点赞',
				}, {
					text: '回复',
				}];
				var user = getApp().globalData.userInfo;
				if (user && this.reply.userkey.userkey === user.userkey) {
					temp.push({
						text: '删除'
					});
				}
				return temp;
			}
		},
	}
</script>

<style>
	.r-wrap{
		display: flex;
		padding-top: 10rpx;
	}
	.content{
		width: 100%;
		padding-bottom: 10rpx;
		border-bottom: 1px solid #f7f7f7;
	}
	.main-reply{
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
	.reply-con {
		font-size: 14px;
		margin: 8rpx 0;
		display: flex;
	}
</style>
