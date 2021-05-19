<template>
	<view v-if="reply" class="r-wrap">
		<view class="avatar">
			<navigator :url="`../userDetail/userDetail?userkey=${reply.userkey.userkey}`">
				<u-avatar :src="$utils.url2img(reply.userkey.headImage)" size="64"></u-avatar>
			</navigator>
		</view>
		<view class="content">
			<view class="main-reply">
				<view class="user-info">
					<navigator :url="`../userDetail/userDetail?userkey=${reply.userkey.userkey}`">
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
								<navigator :url="`../userDetail/userDetail?userkey=${reply.reply.userkey}`">{{reply.reply.userkey.nickName}}</navigator>
							</view>
							<text>：</text>
						</block>
						<text>{{reply.content}}</text>
					</view>
					<view class="time">{{$utils.fromNowStr(reply.createAt)}}</view>
				</view>
				<view class="thumb">
					<u-icon @click="thumb" :color="reply.thumb?'#fc0':'#000'" name="thumb-up" size="36"></u-icon>
					<text v-if="reply.thumbs" style="color: #666;font-size: 12px;">{{reply.thumbs}}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import {thumbById} from '@/api/hit'
	export default {
		name:"ReplyBox",
		data() {
			return {
				
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
							this.reply.thumb = true;
							this.reply.thumbs++;
						}else{
							this.$emit("toast",{
								title: '您已经赞过了',
								type: 'warning'
							});
						}
					}
				})
			},
		}
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
