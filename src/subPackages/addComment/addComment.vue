<template>
	<view>
		<u-navbar title-color="#000" back-text="取消" title="发表评论" back-icon-name="">
			<text @click="doComment" style="color: #fc0;margin-right:10rpx;font-size: 32rpx;" slot="right">发表</text>
		</u-navbar>
		<view class="main">
			<view class="container">
				<textarea style="min-height: 400rpx;width:720rpx" v-model="content" :placeholder="placeholder" auto-height :maxlength="-1"/>
			</view>
			<view class="button-box">
				<u-button :loading="submitting" @click="doComment" type="primary" shape="circle" size="mini">发表</u-button>
			</view>
		</view>
		<u-toast ref="uToast"/>
	</view>
</template>

<script>
	import {commentObj} from '@/api/comment.js'
	export default {
		data() {
			return {
				content : null,
				user : null,
				commentReq : null,
			}
		},
		methods: {
			doComment(){
				if(!this.content){
					return;
				}
				this.commentReq.content = this.content;
				commentObj(this.commentReq).then((res)=>{
					if(res.code == 200){
						this.content = "";
						let temp = {
							...this.commentReq,
							id : res.data
						}
						const eventChannel = this.getOpenerEventChannel();
						eventChannel.emit('successEvent', temp);
						this.$refs.uToast.show({
							title: '评论成功',
							type: 'success',
							duration : 500,
							back : true,
						});
					}
				})
			}
		},
		onLoad(option) {
			const eventChannel = this.getOpenerEventChannel();
			eventChannel.on('openCommentBox', (data) => {
				this.commentReq = data.data;
				this.user = data.user;
			})
		},
		computed:{
			placeholder(){
				if(this.user){
					return `回复${this.user}的评论`;
				}
				return "发表你的评论";
			}
		}
	}
</script>

<style scoped>
	.container{
		padding: 16rpx;
	}
	.main{
		padding-bottom: 80rpx;
	}
	.button-box {
		display: flex;
		justify-content: space-between;
		border-top: 1px solid #e7e7e7;
		border-bottom: 1px solid #e7e7e7;
		align-items: flex-end;
		padding: 10rpx 20rpx;
	}
</style>
