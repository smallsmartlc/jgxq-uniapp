<template>
	<view class="wrap">
		<u-navbar back-icon-name='arrow-leftward' title="登录">
			<view slot="right" @click="flag=!flag">{{flag?'验证码':'密码'}}登录</view>
		</u-navbar>
		<view class="header">经管雄起</view>
		<view class="form" v-show="flag">
			<u-form :model="user" ref="loginForm">
				<u-form-item label="邮箱" prop="email" :label-style="labelStyle">
					<u-input v-model="user.email" placeholder="请输入电子邮箱" clearable />
				</u-form-item>
				<u-form-item label="密码" prop="password" :label-style="labelStyle">
					<u-input v-model="user.password" placeholder="请输入密码" type="password" clearable />
				</u-form-item>
				<view class="right">
					<navigator url="../findPassword/findPassword"><text class="link">忘记密码</text></navigator>
				</view>
			</u-form>
		</view>
		<view class="form" v-show="!flag">
			<u-form :model="user" ref="emailForm">
				<u-form-item label="邮箱" label-width="120" :label-style="labelStyle" prop="email">
					<u-input v-model="user.email" placeholder="请输入电子邮箱" clearable />
					<view slot="right" class="text-btn" @click="sendCode" :class="codeDisabled?'':'disabled'">
						{{tips}}
					</view>
				</u-form-item>
				<u-form-item label="验证码" label-width="120" :label-style="labelStyle" prop="verificationCode">
					<u-input v-model="user.verificationCode" placeholder="请输入验证码" clearable>
					</u-input>
				</u-form-item>
			</u-form>
			<u-verification-code seconds="60" ref="uCode" @change="codeChange" @end="codeDisabled=false" @start="codeDisabled=true"></u-verification-code>
		</view>
		<view class="footer">
			<u-button @click="submit" type="primary" plain ripple :loading="loading">登录</u-button>
		</view>
		<view class="to-reg">
			<text>还没有账号？</text>
			<navigator url="../register/register"><text class="link">注册新账号</text></navigator>
		</view>
		<u-toast ref="uToast" />
	</view>
</template>

<script>
	import {
		validateEmail,
		validatePass,
		validateVerCode,
		testEmail
	} from "@/utils/validateInput"
	import {
		userLogin,
		emailLogin,
		getCode
	} from '@/api/login'
	import {
		setUserInfo
	} from '@/utils/store.js'
	export default {
		data() {
			return {
				tips:'获取验证码',
				loading: false,
				flag: false,
				codeDisabled : false,
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
				labelStyle: {
					marginLeft: '16rpx'
				}
			}
		},
		methods: {
			submit() {
				if (this.flag) {
					this.login();
				} else {
					this.loginByCode();
				}
			},
			sendCode() {
				this.$refs.emailInput.$el.children[0].blur();
				if (this.codeDisabled) return;
				if(!testEmail(this.user.email)) return;
				if(this.$refs.uCode.canGetCode) {
					this.codeDisabled = true;
					getCode(this.user.email).then((res) => {
						if (res.code == 200) {
							if (res.data) {
								this.codeInfo = 60;
								this.$refs.uToast.show({
									title: '验证码发送成功',
									type: 'success'
								});
								this.$refs.uCode.start();
							} else {
								this.$refs.uToast.show({
									title: res.msg,
									type: 'warning'
								});
							}
						} else {
							this.$refs.uToast.show({
								title: res.msg,
								type: 'warning'
							});
						}
					}).finally(() => this.codeDisabled = false)
				}
			},
			login() {
				this.$refs['loginForm'].validate((valid) => {
					if (valid) {
						this.loading = true;
						userLogin(this.user).then((res) => {
							if (res.code == 200) {
								var userInfo = res.data;
								setUserInfo(userInfo);
								this.user = getApp().globalData.userInfo;
								this.$refs.uToast.show({
									title: '登陆成功',
									type: 'success'
								});
								uni.navigateBack();
							} else {
								this.$refs.uToast.show({
									title: res.msg,
									type: 'error'
								});
							}
							this.loading = false;
						}).finally(() => this.loading = false)
					} else {
						return false;
					}
				})
			},
			loginByCode() {
				this.$refs['emailForm'].validate((valid) => {
					if (valid) {
						this.loading = true;
						emailLogin(this.user).then((res) => {
							if (res.code == 200) {
								var userInfo = res.data;
								setUserInfo(userInfo);
								this.user = getApp().globalData.userInfo;
								this.$refs.uToast.show({
									title: '登陆成功',
									type: 'success'
								});
								uni.navigateBack()
							} else {
								this.$refs.uToast.show({
									title: res.msg,
									type: 'error'
								});
							}
							this.loading = false;
						}).finally(() => this.loading = false)
					} else {
						return false;
					}
				})
			},
			codeChange(text) {
				this.tips = text;
			},
		},
		onReady() {
			this.$refs.loginForm.setRules(this.rules);
			this.$refs.emailForm.setRules(this.rules);
		},
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

	.form {
		margin: 0 20rpx;
	}

	.text-btn {
		display: inline-block;
		font-size: 12px;
		padding: 0 20rpx;
		margin-left: 20rpx;
		border-left: 1px solid #f2f2f2;
		color: #fc0;
	}

	.disabled {
		color: #aaa;
	}

	.footer {
		padding: 20rpx;

	}
	.to-reg{
		display: flex;
		justify-content: center;
		color: #888;
	}
	.link{
		color: #fc0;
	}
	.right{
		display: flex;
		flex-direction: row-reverse;
	}
</style>
