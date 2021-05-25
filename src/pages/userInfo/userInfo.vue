<template>
	<view v-if="user">
		<view class="list">
			<view class="j-section">
				<u-section :show-line="false" :bold="false" :sub-title="user.email" title="邮箱" :arrow="false"></u-section>
			</view>
			<view class="j-section">
				<u-section :show-line="false" :bold="false" title="头像" >
					<view slot="right" class="right-box">
						<u-avatar class="u-margin-right-16" :src="$utils.url2img(user.headImage)" size="60"></u-avatar>
						<u-icon size="24" name="arrow-right"></u-icon>
					</view>
				</u-section>
			</view>
			<view class="j-section">
				<u-section :show-line="false" :bold="false" :sub-title="user.nickName" title="昵称" ></u-section>
			</view>
			<view class="j-section">
				<u-section :show-line="false" :bold="false" :sub-title="user.city" title="城市" ></u-section>
			</view>
			<view class="j-section">
				<u-section :show-line="false" :bold="false" :sub-title="user.nickName" title="主队" >
					<view slot="right" class="right-box">
						<u-image class="u-margin-right-16" v-if="user.homeTeam" :src="$utils.url2img(user.homeTeam.logo)" width="60" height="60"></u-image>
						<u-icon size="24" name="arrow-right"></u-icon>
					</view>
				</u-section>
			</view>
		</view>
		<view class="big-button" @click="logout"><text>退出登录</text></view>
	</view>
</template>

<script>
	import {userLogOut} from '@/api/login'
	import {setUserInfo} from '@/utils/store.js'
	export default {
		data() {
			return {
				user : Object,
			}
		},
		onShow() {
			this.user = getApp().globalData.userInfo;
		},
		methods: {
			logout(){
				setUserInfo(null);
				// #ifdef H5
				userLogOut();
				// #endif
				this.user = getApp().globalData.userInfo;
				uni.switchTab({
					url : "../index/index"
				})
			},
		}
	}
</script>

<style scoped>

.list{
	border-top: 8px solid #f7f7f7;
	border-bottom: 8px solid #f7f7f7;
}
.j-section{
	padding: 24rpx;
	display: flex;
	align-items: center;
	color: #fc0;
	font-size: 40rpx;
}
.right-box{
	display: flex;
	align-items: center;
}
.big-button{
	padding: 32rpx;
	color: #E6A23C;
	text-align: center;
	font-size: 16px;
	box-shadow: 0 3px 3px #d7d7d7;
}
.big-button:active{
	background-color: #f2f2f2;
}
</style>
