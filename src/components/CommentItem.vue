<template>
	<view v-if="comment" class="container">
		<view class="info">
			<navigator :url="`/subPackages/userDetail/userDetail?userkey=${comment.userkey.userkey}`">
				<view class="user">
					<view class="headImg">
						<u-avatar :src="$utils.url2img(comment.userkey.headImage)" size="80"></u-avatar>
					</view>
					<view class="user-info">
						<view class="name">
							<view style="margin-right: 8rpx;">{{comment.userkey.nickName}}</view>
							<view v-if="comment.userkey.homeTeam">
								<u-image width="28" height="28" :src="$utils.url2img(comment.userkey.homeTeam.logo)"
									mode="aspectFill"></u-image>
							</view>
						</view>
						<view class="time">{{$utils.fromNowStr(comment.createAt)}}</view>
					</view>
				</view>
			</navigator>
			<view v-if="reply">
				<text style="color: #666;font-size: 10px;">{{comment.thumbs}}</text>
				<u-icon @click="thumb" :color="comment.thumb?'#fc0':'#000'" name="thumb-up" size="28"></u-icon>
			</view>
			<view v-else class="thumb">
				<text style="color: #666;font-size: 10px;">{{comment.hits.thumbs}}</text>
				<u-icon @click="thumb" :color="comment.hits.thumb?'#fc0':'#000'" name="thumb-up" size="28"></u-icon>
			</view>
		</view>
		<view class="content" @click="show=true">
			<text>{{comment.content}}</text>
		</view>
		<u-action-sheet @click="clickContent" :list="list" v-model="show"></u-action-sheet>
	</view>
</template>

<script>
	import {
		thumbById
	} from '@/api/hit'
	import {deleteComment} from '@/api/comment.js'
	export default {
		name: "CommentItem",
		data() {
			return {
				show: false,
			};
		},
		props: {
			comment: Object,
			reply: {
				type: Boolean,
				default: false,
			}
		},
		methods: {
			thumb() {
				thumbById(2, this.comment.id).then((res) => {
					if (res.code == 200) {
						if (res.data) {
							this.$emit("thumb")
						} else {
							this.$emit("toast",{
								title: '您已经赞过了',
								type: 'warning'
							});
						}
					}
				})
			},
			replyComment() {
				this.$emit('reply');
			},
			deleteComment() {
				deleteComment(this.comment.id).then((res) => {
					if (res.code == 200) {
						if (res.data == true) {
							this.$emit('delete');
						} else {
							this.$emit("toast",{
								title: '删除失败,评论不存在',
								type: 'warning'
							});
						}
					}
				})
			},
			clickContent(index) {
				switch (this.list[index].text) {
					case '点赞':
						this.thumb();
						break;
					case '回复':
						this.replyComment();
						break;
					case '删除':
						this.deleteComment();
						break;
				}
			}
		},
		computed: {
			list() {
				var temp = [{
					text: '点赞',
				}, {
					text: '回复',
				}];
				var user = getApp().globalData.userInfo;
				if (user && this.comment && this.comment.userkey.userkey === user.userkey) {
					temp.push({
						text: '删除'
					});
				}
				return temp;
			}
		}
	}
</script>

<style scoped>
	.container {
		padding: 16rpx;
	}

	.info {
		display: flex;
		justify-content: space-between;
		height: 80rpx;
	}

	.user {
		display: flex;
		align-items: center;
	}

	.user-info {
		margin-left: 8rpx;
		display: flex;
		flex-direction: column;
	}

	.user-info .name {
		font-size: 14px;
		color: #fc0;
		display: flex;
		align-items: center;
	}

	.user-info .time {
		font-size: 8px;
		color: #666;
	}
</style>
