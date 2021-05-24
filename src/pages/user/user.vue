<template>
	<view>
		<view class="wrap">
			<view class="user-info">
				<view v-if="user" class="user-wrap">
					<view class="info">
						<view class="head-img">
							<u-avatar style="border: 2px solid #fff;" :src="$utils.url2img(user.headImage)" size="100"></u-avatar>
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
		<view class="list">
			<navigator :url="`../message/message`">
				<view class="j-section">
					<u-icon name="chat" style="margin-right: 12rpx;"></u-icon>
					<u-section :show-line="false" :bold="false" title="消息" ></u-section>
				</view>
			</navigator>
			<navigator :url="`../collect/collect`">
				<view class="j-section">
					<u-icon name="star-fill" style="margin-right: 12rpx;"></u-icon>
					<u-section :show-line="false" :bold="false" sub-title="" title="我的收藏" ></u-section>
				</view>
			</navigator>
		</view>
		<u-button @click="logout" type="primary" plain ripple>退出登陆</u-button>
		<u-button @click="login" type="primary" plain ripple>登陆</u-button>
		<u-tabbar active-color="#fc0" :list="tabbar" :mid-button="true"></u-tabbar>
	</view>
</template>

<script>
	import {userLogin,userLogOut} from '@/api/login'
	import {setUserInfo} from '@/utils/store.js'
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
			login(){
				userLogin({
					email :"small-smart@qq.com",
					password : "abc123"
				}).then((res)=>{
					if(res.code == 200){
						var userInfo = res.data;
						setUserInfo(userInfo);
						this.user = getApp().globalData.userInfo;
					}
				})
			},
			logout(){
				setUserInfo(null);
				// #ifdef H5
				userLogOut();
				// #endif
				this.user = getApp().globalData.userInfo;
			},
			loadingUser(){
				getUserInfo().then((res)=>{
					if(res.code == 200){
						this.userInfo = res.data;
					}
				})
			},
		},
		computed:{
			regDays(){
				return this.$moment().diff(this.user.createAt,'day');
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
.list{
	margin: 20rpx 0;
}
.j-section{
	padding: 24rpx;
	display: flex;
	align-items: center;
	color: #fc0;
	font-size: 40rpx;
}
</style>
