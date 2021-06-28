<template>
	<view v-if="user">
		<view class="list">
			<view class="j-section">
				<u-section :show-line="false" :bold="false" :sub-title="user.email" title="邮箱" :arrow="false" class="section-wrap"></u-section>
			</view>
			<view class="j-section" @click="show=true">
				<u-section :show-line="false" :bold="false" title="头像" class="section-wrap">
					<view slot="right" class="right-box">
						<view @click.stop="$utils.prewImage(user.headImage)">
							<u-avatar class="u-margin-right-16" :src="$utils.url2img(user.headImage)" size="60"></u-avatar>
						</view>
						<u-icon size="24" name="arrow-right"></u-icon>
					</view>
				</u-section>
			</view>
			<view class="j-section">
				<u-section :show-line="false" :bold="false" :sub-title="user.nickName" title="昵称" class="section-wrap" ></u-section>
			</view>
			<view class="j-section">
				<u-section :show-line="false" :bold="false" :sub-title="user.city" title="城市" class="section-wrap" ></u-section>
			</view>
			<view class="j-section">
				<u-section :show-line="false" :bold="false" :sub-title="user.nickName" title="主队" class="section-wrap" >
					<view slot="right" class="right-box">
						<u-image class="u-margin-right-16" v-if="user.homeTeam" :src="$utils.url2img(user.homeTeam.logo)" width="60" height="60"></u-image>
						<u-icon size="24" name="arrow-right"></u-icon>
					</view>
				</u-section>
			</view>
		</view>
		<view class="big-button" @click="logout"><text>退出登录</text></view>
		<u-popup v-model="show" mode="center" border-radius="14">
			<view class="pop-wrap">
				<view class="pop-item pop-title">修改头像</view>
				<view class="pop-item pop-button">上传图片</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	import {userLogOut} from '@/api/login'
	import {setUserInfo} from '@/utils/store.js'
	import {updateUser} from '@/api/user'
	export default {
		data() {
			return {
				show : false,
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
				// #ifndef H5
				uni.removeStorageSync("authCookie")
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
.j-section:active{
	background-color: #f7f7f7;
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
.pop-wrap{
	width: 600rpx;
}
.section-wrap{
	width: 100%;
}
</style>
