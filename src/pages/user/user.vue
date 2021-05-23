<template>
	<view>
		<view class="wrap">
			<view class="user-info">
				<view v-if="user">
					
					
				</view>
				<view v-else></view>
				<u-image class="bg-img" :src="require('@/static/match-bg.jpg')" width="750" height="400"></u-image>
			</view>
		</view>
		<button @click="login">登陆</button>
		<u-tabbar active-color="#fc0" :list="tabbar" :mid-button="true"></u-tabbar>
	</view>
</template>

<script>
	import {userLogin} from '@/api/login'
	import {setUserInfo} from '@/utils/store.js'
	export default {
		data() {
			return {
				tabbar: null,
				user : null,
			}
		},
		onLoad() {
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
					}
				})
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
	z-index: -100;
}
</style>
