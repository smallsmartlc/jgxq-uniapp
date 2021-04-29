<template>
	<view class="talk-editor">
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
		<u-toast ref="uToast" />
	</view>
</template>

<script>
	import {
		BaseUrl,
		imgUrl
	} from '@/constants/index'
	import {
		addTalk
	} from '@/api/talk'
	export default {
		data() {
			return {
				imgList: [],
				action: BaseUrl + '/file/img/upload/talkimg',
				submitting: false,
			}
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
				uni.createSelectorQuery().select('#editor').context((res) => {
					let editorCtx = res.context;

					editorCtx.getContents({
						success: (res) => {
							console.log(res);
							if (this.$utils.isEmpty(res.text.trim()) && this.imgList.length < 1) {
								this.$refs.uToast.show({
									title: '内容不能为空!',
									type: 'error'
								});
								return;
							}
							text = res.html;
							this.imgList.forEach((img) => {
								text +=
									`<img src="${imgUrl+img}" style="max-width:100%;">&nbsp;`
							})
							this.submitTalk(text);
						},
						fail() {
							return;
						}
					})
				}).exec()

			},
			submitTalk(text) {
				addTalk(text).then((res) => {
					if (res.code == 200) {
						uni.createSelectorQuery().select('#editor').context((res) => {
							res.context.clear();
						});
						this.imgList = [];
						this.$refs.uUpload.lists = [];
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
						this.$emit("success",temp)
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
	#editor {
		border-bottom: 1px solid #e7e7e7;
	}

	.button-box {
		display: flex;
		border-bottom: 1px solid #e7e7e7;
		align-items: center;
		padding: 10rpx 20rpx;
		justify-content: space-between;
	}
</style>
