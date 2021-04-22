<template>
	<view>
		<view class="container">
			<view>
				<editor id="editor" class="ql-container" placeholder="说点什么吧..."></editor>
			</view>
			<view class="button-box">
				<u-upload :action="action" :file-list="fileList" custom-btn>
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
	export default {
		data() {
			return {
				tabbar: null,
				fileList: [],
			}
		},
		onLoad() {},
		onShow() {
			// 加载导航栏参数
			this.tabbar = getApp().globalData.tabbar;
		},
		methods: {

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
		height: 80rpx;
		border-bottom: 1px solid #e7e7e7;
		align-items: center;
	}
</style>
