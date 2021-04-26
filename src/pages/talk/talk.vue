<template>
	<view>
		<view class="container">
			<view>
				<editor id="editor" class="ql-container" placeholder="说点什么吧..."></editor>
			</view>
			<view class="button-box">
				<view>
					<u-upload ref="uUpload" :before-upload="beforeUpload" :before-remove="beforeRemove" custom-btn>
						<view class="button" slot="addBtn">
							<u-icon name="photo" size="48"></u-icon>
						</view>
					</u-upload>
				</view>
				<view>
					<u-button :loading="submitting" @click="submit" type="primary" shape="circle" size="mini">发送
					</u-button>
				</view>
			</view>
		</view>
		<u-toast ref="uToast" />
		<u-tabbar active-color="#fc0" :list="tabbar" :mid-button="true"></u-tabbar>
	</view>
</template>

<script>
	import {
		BaseUrl
	} from '@/constants/index'
	import {
		pageTalk,
		addTalk
	} from '@/api/talk'
	export default {
		data() {
			return {
				tabbar: null,
				imgList: [],
				action: BaseUrl + '/file/img/upload/talkimg',
				submitting: false,
			}
		},
		onLoad() {},
		onShow() {
			// 加载导航栏参数
			this.tabbar = getApp().globalData.tabbar;
		},
		methods: {
			beforeRemove(index, list) {
				this.imgList.splice(index, 1);
			},
			beforeUpload(index, list) {
				// 在这里自定义上传逻辑
				uni.uploadFile({
					url: BaseUrl + '/file/img/upload/talkimg',
					filePath: list[index].url,
					name: 'file',
					success: (res) => {
						let temp = JSON.parse(res.data)
						console.log(temp);
						if (temp.code == '200') {
							this.imgList.push(temp.data);
						} else {
							this.$refs.uToast.show({
								type: "error",
								title: '图片上传失败',
							})
						}
					},
					fail: (err) => {
						this.$refs.uToast.show({
							type: "error",
							title: '图片上传失败',
						})
					}

				})
				return false;
			},
			submit() {
				this.submiting = true;
				let text = "";
				// todo 获取编辑器中的html内容
				addTalk(text).then((res) => {
					if (res.code == 200) {
						this.$refs.uToast.show({
							title: '发帖成功!',
							type: 'success'
						});
						var temp = {
							author: getApp().globalData.userInfo,
							hit: {
								collect: false,
								comments: 0,
								thumb: false,
								thumbs: 0,
							},
							id: res.data,
							text: text,
						}
						this.talks.unshift(temp);
					} else {
						this.$message({
							title: '发送失败!',
							type: 'error'
						});
					}
					this.submiting = false;
				})
			}
		}
	}
</script>

<style scoped>
	.container {
		padding: 16rpx;
	}

	#editor {
		border-bottom: 1px solid #e7e7e7;
		height: 250rpx;
	}

	.button-box {
		display: flex;
		border-bottom: 1px solid #e7e7e7;
		align-items: center;
		padding: 10rpx 20rpx;
		justify-content: space-between;
	}
</style>
