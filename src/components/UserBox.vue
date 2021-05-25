<template>
	<navigator :url="`../userDetail/userDetail?userkey=${user.userkey}`">
		<view class="wrap">
			<view class="main">
				<view class="avatar">
					<u-avatar :src="$utils.url2img(user.headImage)" size="80"></u-avatar>
				</view>
				<view class="content">
					<view class="name">{{user.nickName}}</view>
					<view class="city">来自{{user.city}}</view>
				</view>
			</view>
			<view class="focus">
				<u-button @click.stop="focusOther()" :type="user.focus?'default':'primary'" plain size="mini"
					:custom-style="buttonStyle">
					<u-icon :name="user.focus?'checkbox-mark':'plus'"></u-icon>
					<text>{{user.focus?'已关注':'关注'}}</text>
				</u-button>
			</view>
		</view>
	</navigator>
</template>

<script>
	import {focusUser} from '@/api/user'
	export default {
		name: "UserBox",
		data() {
			return {
				buttonStyle: {
					width: "140rpx"
				}
			};
		},
		methods: {
			focusOther() {
				focusUser(this.user.userkey, this.user.focus).then((res) => {
					if (res.code == 200) {
						if (res.data == true) {
							var str = this.user.focus ? "取消关注成功" : "关注成功!";
							this.$emit("toast",{
								title: str,
								type: 'success'
							});
							this.user.focus = !this.user.focus
						} else {
							var str = this.user.focus ? "取消关注失败" : "已关注"
							this.$emit("toast",{
								title: str,
								type: 'warning'
							});
						}
					}
				})
			}
		},
		props: {
			user: Object,
		}
	}
</script>

<style scoped>
	.wrap {
		display: flex;
		justify-content: space-between;
		padding: 20rpx;
		border-bottom: 1px solid #f7f7f7;
	}

	.main {
		display: flex;
		align-items: center;
	}

	.avatar {
		margin-right: 20rpx;
	}

	.name {
		font-size: 16px;
	}

	.city {
		color: #666;
		font-size: 10px;
	}

	.focus {
		display: flex;
		align-items: center;
	}
</style>
