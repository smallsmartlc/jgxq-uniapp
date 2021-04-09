<template>
	<view>
		<button @click="login">登陆</button>
		<u-tabbar active-color="#fc0" :list="tabbar" :mid-button="true"></u-tabbar>
	</view>
</template>

<script>
	import {userLogin} from '@/api/login'
	export default {
		data() {
			return {
				tabbar: null,
			}
		},
		onLoad() {
			// 加载导航栏参数
			uni.getStorage({
				key : "tabbar",
				success: (res)=>{
					this.tabbar = res.data;
				}
			})
		},
		methods: {
			
			login(){
				userLogin({
					email :"small-smart@qq.com",
					password : "abc123"
				}).then((res)=>{
					console.log(res);
				})
			}
		}
	}
</script>

<style>

</style>
