<template>
	<view class="wrap">
		<u-navbar back-icon-name='arrow-leftward' title="登录">
			<view slot="right">{{flag?'验证码':'密码'}}登录</view>
		</u-navbar>
		<view class="header">经管雄起</view>
		<view class="form" v-if="flag">
			<u-form @submit.native.prevent :model="user" ref="loginForm">
				<u-form-item prop="email" label-style="labelStyle">
					<u-input v-model="user.email" placeholder="请输入电子邮箱" prefix-icon="el-icon-message" clearable />
				</u-form-item>
				<u-form-item prop="password">
					<u-input v-model="user.password" placeholder="请输入密码" show-password prefix-icon="el-icon-lock"
						clearable />
				</u-form-item>
				<div style="text-align:right">
					<!-- <el-link href="/find-password" type="primary" :underline="false">忘记密码</el-link> -->
				</div>
				<u-form-item>
					<!-- <el-button native-type="submit" @click="login" type="primary" style="width:100%;margin:10px 0">登录
					</el-button> -->
				</u-form-item>
			</u-form>
		</view>
		<view class="form" v-else>
			<u-form :model="user" ref="emailForm">
				<u-form-item label="邮箱" label-width="120" :label-style="labelStyle" prop="email">
					<u-input v-model="user.email" placeholder="请输入电子邮箱" prefix-icon="el-icon-message" clearable />
					<view class="text-btn" :class="codeDisabled?'':'disabled'">
						获取验证码
					</view>
				</u-form-item>
				<u-form-item label="验证码" label-width="120" :label-style="labelStyle" prop="verificationCode">
					<u-input v-model="user.verificationCode" placeholder="请输入验证码" prefix-icon="el-icon-key" clearable></u-input>
				</u-form-item>
			</u-form>
		</view>
		<view class="footer">
			<u-button @click="login" type="primary" plain ripple>登录</u-button>
		</view>
	</view>
</template>

<script>
	import {
		validateEmail,
		validatePass,
		validateVerCode
	} from "@/utils/validateInput"
	import {
		userLogin
	} from '@/api/login'
	import {
		setUserInfo
	} from '@/utils/store.js'
	export default {
		data() {
			return {
				flag: false,
				user: {
					email: "",
					password: "",
					verificationCode: null,
				},
				rules: {
					email: [{
						validator: validateEmail,
						trigger: 'blur'
					}],
					password: [{
						validator: validatePass,
						trigger: 'blur'
					}, ],
					verificationCode: [{
						validator: validateVerCode,
						trigger: 'blur'
					}, ],
				},
				labelStyle:{
					marginLeft : '16rpx'
				}
			}
		},
		methods: {
			login() {
				userLogin({
					email: "small-smart@qq.com",
					password: "abc123"
				}).then((res) => {
					if (res.code == 200) {
						var userInfo = res.data;
						setUserInfo(userInfo);
						this.user = getApp().globalData.userInfo;
						uni.navigateBack()
					}
				})
			},
		},
		onReady() {
			this.$refs.loginForm.setRules(this.rules);
			this.$refs.emailForm.setRules(this.rules);
		},
		computed:{
			codeDisabled(){
				return this.user.email;
			}
		}
	}
</script>

<style scoped>
	.header {
		width: 750rpx;
		height: 100rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 20px;
		background-color: #f7f7f7;
	}
	.form{
		margin: 0 20rpx;
	}
	.text-btn{
		display: inline-block;
		font-size: 12px;
		padding: 0 20rpx;
		margin-left: 20rpx;
		border-left: 1px solid #f2f2f2;
		color: #fc0;
	}
	.disabled{
		color: #aaa;
	}
	.footer{
		padding: 20rpx;
		
	}
</style>
