<template>
	<view class="wrap">
		<u-navbar :background="backgroundStyle" immersive back-icon-color="#fff" :border-bottom="false"></u-navbar>
		<view class="header">
			<u-image class="bg-img" :src="require('@/static/match-bg.jpg')" width="750" height="400"></u-image>
			<view class="user-wrap" v-if="user">
				<view style="color: #fff;">
					<view class="avatar">
						<view class="head-img">
							<u-avatar @click="$utils.prewImage(user.userInfo.headImage)" :src="$utils.url2img(user.userInfo.headImage)" size="100"></u-avatar>
						</view>
						<view v-if="!isMe">
							<u-button @click.stop="focusOther" :type="user.focused?'default':'primary'" plain size="mini"
								:custom-style="buttonStyle">
								<u-icon :name="user.focused?'checkbox-mark':'plus'"></u-icon>
								<text>{{user.focused?'已关注':'关注'}}</text>
							</u-button>
						</view>
					</view>
					<view class="name" style="font-size: 16px;">
						<text>
							{{user.userInfo.nickName}}
						</text>
						<u-icon size="28" v-if="user.userInfo.homeTeam" :name="$utils.url2img(user.userInfo.homeTeam.logo)"></u-icon>
					</view>
					<view class="time">
						<text>来自{{user.userInfo.city}}</text>
						<text>已注册经管雄起账号<text class="color-fc0">{{regDays}}</text>天</text>
					</view>
				</view>
			</view>
		</view>
		<view v-if="user">
			<u-tabs-swiper style="box-shadow: 0 2px 3px #f7f7f7;" active-color="#fc0" ref="uTabs" :list="tabs" :current="current" @change="change" :bold="false" gutter="120"></u-tabs-swiper>
			<swiper style="height: calc(100vh - 480rpx);" :current="current"
				@animationfinish="animationfinish">
				<swiper-item class="swiper-item">
					<UserIssue :user="user.userInfo"></UserIssue>
				</swiper-item>
				<swiper-item class="swiper-item">
					<UserComment :user="user.userInfo"></UserComment>
				</swiper-item>
				<swiper-item class="swiper-item">
					<UserFocus :user="user.userInfo"></UserFocus>
				</swiper-item>
				<swiper-item class="swiper-item">
					<UserFans :user="user.userInfo"></UserFans>
				</swiper-item>
			</swiper>
		</view>
		<u-toast ref="uToast" />
	</view>
</template>

<script>
	import {getUserInfo,focusUser} from '@/api/user'
	import UserIssue from './UserIssue.vue'
	import UserComment from './UserComment.vue'
	import UserFocus from './UserFocus.vue'
	import UserFans from './UserFans.vue'
	export default {
		components:{
			UserIssue,UserComment,UserFans,UserFocus
		},
		data() {
			return {
				user : null,
				current: 0,
				buttonStyle: {
					width: "140rpx"
				},
				backgroundStyle: {
					background: 'transparent',
				},
			}
		},
		methods: {
			loadingUser(key){
				getUserInfo({target:key?key:""}).then((res)=>{
					if(res.code == 200){
						this.user = res.data;
					}
				})
			},
			focusOther() {
				focusUser(this.user.userInfo.userkey, this.user.focused).then((res) => {
					if (res.code == 200) {
						if (res.data == true) {
							var str = this.user.focused ? "取消关注成功" : "关注成功!";
							this.$refs.uToast.show({
								title: str,
								type: 'success'
							});
							this.user.focused = !this.user.focused
						} else {
							var str = this.user.focused ? "取消关注失败" : "已关注"
							this.$refs.uToast.show({
								title: str,
								type: 'warning'
							});
						}
					}
				})
			},
			animationfinish(e) {
				let current = e.detail.current;
				this.$refs.uTabs.setFinishCurrent(current);
				this.current = current;
			},
			change(index) {
				this.current = index;
			}
		},
		onLoad(option) {
			this.loadingUser(option.userkey);
			if(option.index){
				this.current = option.index;
			}
		},
		computed:{
			regDays(){
				if(this.user) return this.$moment().diff(this.user.userInfo.createAt,'day');
				return null;
			},
			tabs(){
				return [{
					name: '发表',
					count : this.user?this.user.talks:0
				}, {
					name: '评论',
					count : this.user?this.user.comments:0
				}, {
					name: '关注',
					count : this.user?this.user.focus:0
				}, {
					name: '粉丝',
					count : this.user?this.user.fans:0
				}];
			},
			isMe(){
				if(!this.user || !getApp().globalData.userInfo){
					return false;
				}
				return getApp().globalData.userInfo.userkey == this.user.userInfo.userkey
			}
		}
	}
</script>

<style scope>
	.header {
		width: 750rpx;
		height: 400rpx;
	}
	.bg-img {
		position: absolute;
		z-index: -100;
	}
	.head-img{
		margin: 0 20rpx;
		width: 100rpx;
		height: 100rpx;
		border: 2px solid #fff;
		border-radius: 50%;
		box-sizing: content-box;
	}
	.user-wrap{
		width: 750rpx;
		height: 400rpx;
		padding: 40rpx;
		display: flex;
		flex-direction: column-reverse;
	}
	.avatar{
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	.name{
		display: flex;
		align-items: center;
	}
	.time{
		font-size: 10px;
	}
	.time text{
		margin-right: 8rpx;
	}
	.color-fc0{
		color: #fc0;
	}
</style>
