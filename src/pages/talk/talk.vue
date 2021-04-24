<template>
	<view>
		<view class="container">
			<view>
				<editor id="editor" class="ql-container" placeholder="说点什么吧..."></editor>
			</view>
			<view class="button-box">
				<u-upload :show-upload-list="false" :before-upload="beforeUpload" :file-list="fileList" custom-btn>
					<view class="button" slot="addBtn">
						<u-icon name="photo" size="48"></u-icon>
					</view>
				</u-upload>
			</view>
		</view>
		<u-tabbar active-color="#fc0" :list="tabbar" :mid-button="true"></u-tabbar>
	</view>
</template>

<script>
	import { BaseUrl } from '@/constants/index'
	export default {
		data() {
			return {
				tabbar: null,
				fileList: [],
				action : BaseUrl + '/file/img/upload/talkimg',
				header: {
					'cookie': uni.getStorageSync("authCookie") || ''
				},
			}
		},
		onLoad() {},
		onShow() {
			// 加载导航栏参数
			this.tabbar = getApp().globalData.tabbar;
		},
		methods: {
			beforeUpload(index, list){
				// 在这里自定义上传逻辑
				console.log(list[index])
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
