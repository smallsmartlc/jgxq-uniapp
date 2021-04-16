<template>
	<view class="container">
		<view class="info">
			<navigator :url="`../userDetail/userDetail?userkey=${comment.userkey.userkey}`">
				<view class="user">
					<view class="headImg">
						<u-avatar :src="$utils.url2img(comment.userkey.headImage)" size="60"></u-avatar>
					</view>
					<view class="user-info">
						<view class="name">
							<view style="margin-right: 8rpx;">{{comment.userkey.nickName}}</view>
							<view><u-image width="28" height="28" v-if="comment.userkey.homeTeam" :src="$utils.url2img(comment.userkey.homeTeam.logo)" mode="aspectFill"></u-image></view>
						</view>
						<view class="time">{{$utils.fromNowStr(comment.createAt)}}</view>
					</view>
				</view>
			</navigator>
			<view class="thumb">
				<text style="color: #666;font-size: 10px;">{{comment.hits.thumbs}}</text>
				<u-icon @click="thumb" :color="comment.hits.thumb?'#fc0':'#000'" name="thumb-up" size="28"></u-icon>
			</view>
		</view>
		<view class="content">
			<text>{{comment.content}}</text>
		</view>
		<u-toast ref="uToast" />
	</view>
</template>

<script>
	import {thumbById} from '@/api/hit'
	export default {
		name:"CommentItem",
		data() {
			return {
				
			};
		},
		props:{
			comment:Object,
		},
		methods:{
			thumb(){
				thumbById(2,this.comment.id).then((res)=>{
					if(res.code == 200){
						if(res.data){
							this.comment.hits.thumb = true;
							this.comment.hits.thumbs++;
						}else{
							this.$refs.uToast.show({
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

<style scoped>
	.container{
		padding: 16rpx;
	}
	.info{
		display: flex;
		justify-content: space-between;
		height: 80rpx;
	}
	.user{
		display: flex;
		align-items: center;
	}
	.user-info{
		margin-left: 8rpx;
		display: flex;
		flex-direction: column;
	}
	.user-info .name{
		font-size: 14px;
		color: #fc0;
		display: flex;
		align-items: center;
	}
	.user-info .time{
		font-size: 8px;
		color: #666;
	}
</style>
