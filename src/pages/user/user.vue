<template>
	<view>
		
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

<style>

</style>
