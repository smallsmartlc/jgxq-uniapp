<template>
	<view>
		<view class="header">经管雄起</view>
		<view class="form">
			<u-form :model="user" ref="regForm">
				<u-form-item label="邮箱" label-width="140" prop="email" :label-style="labelStyle">
					<u-input v-model="user.email" placeholder="请输入电子邮箱" clearable />
					<view slot="right" class="text-btn" @click="sendCode" :class="codeDisabled?'':'disabled'">
						{{tips}}
					</view>
				</u-form-item>
				<u-form-item label="验证码" label-width="140" :label-style="labelStyle" prop="verificationCode">
					<u-input v-model="user.verificationCode" placeholder="请输入验证码" clearable>
					</u-input>
				</u-form-item>
				<u-form-item label="密码" label-width="140" prop="password" :label-style="labelStyle">
					<u-input v-model="user.password" placeholder="请输入密码" type="password" clearable />
				</u-form-item>
				<u-form-item label="确认密码" label-width="140" prop="checkpass" :label-style="labelStyle">
					<u-input v-model="user.checkpass" placeholder="再次输入密码" type="password" clearable />
				</u-form-item>
				<u-form-item label="昵称" label-width="140" prop="nickName" :label-style="labelStyle">
					<u-input v-model="user.nickName" placeholder="请输入昵称" clearable />
				</u-form-item>
				<u-verification-code seconds="60" ref="uCode" @change="codeChange" @end="codeDisabled=false"
					@start="codeDisabled=true"></u-verification-code>
			</u-form>
		</view>
		<view class="footer">
			<u-button @click="register" type="primary" plain ripple :loading="loading">注册</u-button>
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
		getCode,
		userRegister
	} from '@/api/register'
	export default {
		data() {
			var validatePassConfirm = (rule, value, callback) => {
				if (value === '') {
					callback(new Error('请再次输入密码'));
				} else if (value !== this.user.password) {
					callback(new Error('两次输入密码不一致!'));
				} else {
					callback();
				}
			};
			return {
				user: {
					nickName: "",
					email: "",
					verificationCode: "",
					password: "",
					checkpass: "",
				},
				tips: '获取验证码',
				codeDisabled: false,
				loading: false,
				rules: {
					email: [{
						validator: validateEmail,
						trigger: 'blur'
					}],
					password: [{
						validator: validatePass,
						trigger: 'blur'
					}, ],
					checkpass: [{
						validator: validatePassConfirm,
						trigger: 'blur'
					}, ],
					verificationCode: [{
						validator: validateVerCode,
						trigger: 'blur'
					}, ],
					nickName: [{
						required: true,
						message: '昵称不能为空哦'
					}]
				},
				labelStyle: {
					marginLeft: '16rpx',
				}
			}
		},
		methods: {
			codeChange(text) {
				this.tips = text;
			},
			sendCode() {
				if (this.codeDisabled) return;
				if (!testEmail(this.user.email)) return;
				if (this.$refs.uCode.canGetCode) {
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
			register() {
				this.$refs['regForm'].validate((valid) => {
					if (valid) {
						this.loading = true;
						userRegister(this.user).then((res) => {
							if (res.code == 200) {
								this.$refs.uToast.show({
									title: '注册成功,快去登陆吧!',
									type: 'success'
								});
								uni.redirectTo({
									url:"/pages/login/login"
								})
							} else {
								this.$refs.uToast.show({
									title: res.msg,
									type: 'error'
								});
							}
						}).finally(() => this.loading = false)
					}
				})
			}
		},
		onReady() {
			this.$refs.regForm.setRules(this.rules);
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

	.link {
		color: #fc0;
	}

	.right {
		display: flex;
		flex-direction: row-reverse;
	}
</style>
