<template>
	<view>
		<view class="container">
			<view>
				<editor id="editor" class="ql-container" placeholder="说点什么吧..."></editor>
			</view>
			<view class="button-box">
				<u-upload ref="uUpload" :before-upload="beforeUpload" 
				:before-remove = "beforeRemove" custom-btn>
					<view class="button" slot="addBtn">
						<u-icon name="photo" size="48"></u-icon>
					</view>
				</u-upload>
			</view>
		</view>
		<u-toast ref="uToast" />
		<u-tabbar active-color="#fc0" :list="tabbar" :mid-button="true"></u-tabbar>
	</view>
</template>

<script>
	import { BaseUrl } from '@/constants/index'
	export default {
		data() {
			return {
				tabbar: null,
				imgList : [],
				action : BaseUrl + '/file/img/upload/talkimg',
			}
		},
		onLoad() {},
		onShow() {
			// 加载导航栏参数
			this.tabbar = getApp().globalData.tabbar;
		},
		methods: {
			beforeRemove(index,list){
				this.imgList.splice(index,1);
			},
			beforeUpload(index, list){
				// 在这里自定义上传逻辑
				uni.uploadFile({
					url : BaseUrl + '/file/img/upload/talkimg',
					filePath:list[index].url,
					name: 'file',
					success: (res) => {
						let temp = JSON.parse(res.data)
						console.log(temp);
						if(temp.code == '200'){
							this.imgList.push(temp.data);
						}else{
							this.$refs.uToast.show({
								type: "error",
								message: '图片上传失败',
							})
						}
					},
					fail: (err) => {
						this.$refs.uToast.show({
							type: "error",
							message: '图片上传失败',
						})
					}
					
				})
				return false;
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
	}
</style>
