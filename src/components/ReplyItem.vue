<template>
	<view>
		<view class="item" @click="show=true">
			<text @click.stop="toUserDetail(item.userkey.userkey)" class="user-link">{{item.userkey.nickName}}</text>
			<block v-if="reply">
				<text style="margin: 0 4rpx;">回复</text>
				<text @click.stop="toUserDetail(item.reply.userkey)" v-if="item.reply" class="user-link">{{item.reply.nickName}}</text>
				<text @click.stop="toUserDetail(reply.userkey)" v-else class="user-link">{{reply.nickName}}</text>
			</block>
			<text>：</text>
			<text>{{item.content}}</text>
		</view>
		<u-action-sheet @click="clickContent" :list="list" v-model="show"></u-action-sheet>
	</view>
</template>

<script>
	import {thumbById} from '@/api/hit'
	import {deleteComment}  from '@/api/comment'
	export default {
		name:"ReplyItem",
		data() {
			return {
				show : false,
			};
		},
		props:{
			reply : Object,
			item  : Object,
		},
		methods:{
			clickContent(index) {
				switch (this.list[index].text) {
					case '详情':
						this.toTalkDetail();
						break;
					case '回复':
						this.replyComment();
						break;
					case '删除':
						this.deleteItem();
						break;
				}
			},
			toTalkDetail(){
				uni.navigateTo({
				    url:`/subPackages/talkDetail/talkDetail?id=${this.item.objectId}`
				});
			},
			toUserDetail(userkey){
				uni.navigateTo({
				    url:`/subPackages/userDetail/userDetail?userkey=${userkey}`
				});
			},
			replyComment(){
				uni.navigateTo({
					url: "/subPackages/addComment/addComment",
					events: {
						successEvent: (data) => {
							var temp = {
								...data,
								reply : this.item.userkey,
								userkey : getApp().globalData.userInfo
							}
							this.$emit("reply",temp);
						}
					},
					success: (res) => {
						if (!this.item) return;
						var req = {};
						if(this.reply){
							req = {
								type: 1,
								objectId: this.item.objectId,
								parentId: this.item.parentId,
								replyId : this.item.id,
								target : this.item.userkey.userkey,
							}
						}else{
							req = {
								type: 1,
								objectId: this.item.objectId,
								parentId: this.item.id,
								target : this.item.userkey.userkey,
							}
						}
						res.eventChannel.emit("openCommentBox", {
							data: req,
							user : this.item.userkey.nickName
						})
					}
				})
			},
			deleteItem(){
				deleteComment(this.item.id).then((res)=>{
					if(res.code == 200){
						if(res.data==true){
							uni.showToast({
								title: '已删除',
							});
							this.$emit('delete');
						}
					}
				})
			}
		},
		computed:{
			list() {
				var temp = [{
					text: '详情',
				}, {
					text: '回复',
				}];
				var user = getApp().globalData.userInfo;
				if (user && this.item.userkey.userkey === user.userkey) {
					temp.push({
						text: '删除'
					});
				}
				return temp;
			},
		}
	}
</script>

<style scoped>
.user-link{
	color: #E6A23C;
	font-weight: 400;
}
.item:active{
	background-color: #f2f2f2;
}
</style>
