<template>
	<view>
		<view class="wrap">
			<view class="user-info">
				<view v-if="user" class="user-wrap">
					<view class="info">
						<view class="head-img">
							<u-avatar class="avatar" @click="$utils.prewImage(user.headImage)" :src="$utils.url2img(user.headImage)" size="100"></u-avatar>/
						</view>
						<view style="color: #fff;">
							<navigator :url="`../userInfo/userInfo`">
								<view class="name">
									<text>
										{{user.nickName}}
									</text>
									<u-icon size="28" v-if="user.homeTeam" :name="$utils.url2img(user.homeTeam.logo)"></u-icon>
								</view>
								<view class="time">已注册经管雄起账号{{regDays}}天</view>
							</navigator>
						</view>
					</view>
					<view class="interact" v-if="userInfo">
						<navigator :url="`../userDetail/userDetail`">
							<view class="info-num">
								<view>{{userInfo.talks}}</view>
								<view class = "description">发表</view>
							</view>
						</navigator>
						<navigator :url="`../userDetail/userDetail?index=1`">
							<view class="info-num">
								<view>{{userInfo.comments}}</view>
								<view class = "description">评论</view>
							</view>
						</navigator>
						<navigator :url="`../userDetail/userDetail?index=2`">
							<view class="info-num">
								<view>{{userInfo.focus}}</view>
								<view class = "description">关注</view>
							</view>
						</navigator>
						<navigator :url="`../userDetail/userDetail?index=3`">
							<view class="info-num">
								<view>{{userInfo.fans}}</view>
								<view class = "description">粉丝</view>
							</view>
						</navigator>
					</view>
				</view>
				<view v-else class="button-wrap">
					<view style="font-size: 16px;color: #fff;">你还没有登录哦，立即登录/注册</view>
					<view class="buttons">
						<navigator :url="`../login/login`">
							<view class="u-button button-fc0">
								<u-icon name="email"></u-icon>
							</view>
						</navigator>
						<navigator :url="`../register/register`">
							<view class="u-button button-fc0">
								<u-icon name="plus-people-fill"></u-icon>
							</view>
						</navigator>
					</view>
				</view>
				<u-image class="bg-img" :src="require('@/static/match-bg.jpg')" width="750" height="360"></u-image>
			</view>
		</view>
		<view class="grid">
			<u-grid :col="2">
				<u-grid-item @click="toMessage">
					<u-icon name="chat" color="#fc0" :size="46"></u-icon>
					<view class="grid-text">消息</view>
				</u-grid-item>
				<u-grid-item @click="toCollect">
					<u-icon name="star-fill" color="#fc0" :size="46"></u-icon>
					<view class="grid-text">我的收藏</view>
				</u-grid-item>
			</u-grid>
		</view>
		<u-tabbar active-color="#fc0" :list="tabbar" :mid-button="true"></u-tabbar>
	</view>
</template>

<script>
	import {getUserInfo} from '@/api/user'
	export default {
		data() {
			return {
				tabbar: null,
				user : null,
				userInfo : null, // 全局变量，登陆状态
			}
		},
		onLoad() {
			this.loadingUser();
		},
		onShow() {
			// 加载导航栏参数
			this.tabbar = getApp().globalData.tabbar;
			this.user = getApp().globalData.userInfo;
		},
		methods: {
			loadingUser(){
				getUserInfo().then((res)=>{
					if(res.code == 200){
						this.userInfo = res.data;
					}
				})
			},
			toMessage(){
				uni.navigateTo({
					url:"../message/message"
				})
			},
			toCollect(){
				uni.navigateTo({
					url:"../collect/collect"
				})
			}
		},
		computed:{
			regDays(){
				if(this.user){
					return this.$moment().diff(this.user.createAt,'day');
				}
			}
		}
	}
</script>

<style scoped>
.user-info {
	width: 750rpx;
	height: 360rpx;
}
.bg-img {
	position: absolute;
	top: 0;
	z-index: -100;
}
.user-wrap{
	height: 360rpx;
}
.user-wrap .info{
	height: 240rpx;
	display: flex;
	align-items: center;
	font-size: 18px;
}
.user-wrap .interact{
	height: 120rpx;
	display: flex;
	justify-content: space-around;
	color: #fff;
	align-items: center;
}
.info .head-img{
	margin: 0 20rpx;
	width: 100rpx;
	height: 100rpx;
	border: 2px solid #fff;
	border-radius: 50%;
	box-sizing: content-box;
}
.info .time{
	font-size: 10px;
}
.interact .info-num{
	text-align: center;
	height: 120rpx;
	width: 120rpx;
	padding: 10rpx;
}
.info-num .description{
	color: rgba(255,255,255,0.7);
	font-size: 12px;
}
.button-wrap{
	height: 360rpx;
	display: flex;
	align-items: center;
	flex-direction: column;
	justify-content: center;
}
.buttons {
	display: flex;
	justify-content: space-around;
	color: #fff;
	font-size: 12px;
	margin-top: 24rpx;
}
.u-button{
	width: 80rpx;
	height: 80rpx;
	border-radius: 50%;
	background-color: #fff;
	display: flex;
	justify-content: center;
	align-items: center;
	font-size: 24px;
	margin: 0 20rpx;
}
.button-fc0{
	color: #fc0;
}
.button-blue{
	color: blue;
}
.grid{
	font-size: 12px;
}
.grid-item{
	width: 100%;
	height: 100%;
}
.avatar{
}
</style>
