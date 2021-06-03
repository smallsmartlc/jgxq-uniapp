<template>
	<view v-if="user">
		<view class="list">
			<view class="j-section">
				<u-section :show-line="false" :bold="false" :sub-title="user.email" title="邮箱" :arrow="false" class="section-wrap"></u-section>
			</view>
			<view class="j-section" @click="imgPop=true">
				<u-section :show-line="false" :bold="false" title="头像" class="section-wrap">
					<view slot="right" class="right-box">
						<view @click.stop="$utils.prewImage(user.headImage)">
							<u-avatar class="u-margin-right-16" :src="$utils.url2img(user.headImage)" size="60"></u-avatar>
						</view>
						<u-icon size="24" name="arrow-right"></u-icon>
					</view>
				</u-section>
			</view>
			<view class="j-section" @click="()=>{namePop=true;nickName = user.nickName}">
				<u-section :show-line="false" :bold="false" :sub-title="user.nickName" title="昵称" class="section-wrap" ></u-section>
			</view>
			<view class="j-section" @click="cityPicker=true">
				<u-section :show-line="false" :bold="false" :sub-title="user.city" title="城市" class="section-wrap" ></u-section>
			</view>
			<view class="j-section" @click="setTeam">
				<u-section :show-line="false" :bold="false" :sub-title="user.nickName" title="主队" class="section-wrap" >
					<view slot="right" class="right-box">
						<u-image class="u-margin-right-16" v-if="user.homeTeam" :src="$utils.url2img(user.homeTeam.logo)" width="60" height="60"></u-image>
						<u-icon size="24" name="arrow-right"></u-icon>
					</view>
				</u-section>
			</view>
		</view>
		<view class="big-button" @click="logout"><text>退出登录</text></view>
		<u-popup v-model="imgPop" mode="center" border-radius="14">
			<view class="pop-wrap">
				<view class="pop-item pop-title">修改头像</view>
				<view class="pop-item pop-button" @click="chooseAvatar">上传图片</view>
			</view>
		</u-popup>
		<u-modal v-model="namePop" @confirm="setNickName" ref="uModal" title="修改昵称" async-close mask-close-able show-cancel-button confirm-color="#fc0">
			<view class="slot-content">
				<u-input v-model="nickName" border maxlength="20" />
			</view>
		</u-modal>
		<u-picker mode="region" @confirm="setCity" v-model="cityPicker" :params="cityParams"></u-picker>
		<u-toast ref="uToast" />
	</view>
</template>

<script>
	import {userLogOut} from '@/api/login'
	import {setUserInfo} from '@/utils/store.js'
	import {updateUser} from '@/api/user'
	import {
		BaseUrl,
		imgUrl
	} from '@/constants/index'
	export default {
		data() {
			return {
				imgPop : false,
				namePop : false,
				cityPicker : false,
				user : Object,
				nickName : "",
				cityParams : {
					province : true,
					city : true,
				}
			}
		},
		onShow() {
			this.user = getApp().globalData.userInfo;
		},
		created() {
			// 监听从裁剪页发布的事件，获得裁剪结果
			uni.$on('uAvatarCropper', path => {
				// this.avatar = path;
				// 可以在此上传到服务端
				uni.uploadFile({
					url: BaseUrl + '/file/img/upload/headimg',
					filePath: path,
					name: 'file',
					success: (res) => {
						let temp = JSON.parse(res.data)
						if (temp.code == '200') {
							this.changeHeadImg(temp.data);
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
				});
			})
		},
		methods: {
			logout(){
				setUserInfo(null);
				// #ifdef H5
				userLogOut();
				// #endif
				// #ifndef H5
				uni.removeStorageSync("authCookie")
				// #endif
				this.user = getApp().globalData.userInfo;
				uni.switchTab({
					url : "../index/index"
				})
			},
			changeHeadImg(url){
				updateUser({"headImage":url}).then((res)=>{
					if(res.code == 200){
						if(res.data){
							this.user.headImage = url;
							this.imgPop = false;
						}else{
							this.$refs.uToast.show({
								type: "warning",
								title: '头像修改失败',
							})
						}
					}
				})
			},
			chooseAvatar() {
				// 此为uView的跳转方法，详见"文档-JS"部分，也可以用uni的uni.navigateTo
				let params =  {
					// 输出图片宽度，高等于宽，单位px
					destWidth: 300,
					// 裁剪框宽度，高等于宽，单位px
					rectWidth: 300,
					// 输出的图片类型，如果'png'类型发现裁剪的图片太大，改成"jpg"即可
					fileType: 'png',
				};
				uni.navigateTo({
					// 关于此路径，请见下方"注意事项"
					url: `../u-avatar-cropper/u-avatar-cropper${this.$u.queryParams(params)}`,
					// 内部已设置以下默认参数值，可不传这些参数
				})
			},
			setNickName(){
				if(this.nickName && this.nickName.trim().split("").length>=2){
					updateUser({"nickName":this.nickName}).then((res)=>{
						if(res.code == 200){
							if(res.data){
								this.user.nickName = this.nickName;
								this.namePop = false;
								this.$refs.uToast.show({
									type: "success",
									title: '修改成功！',
								})
							}else{
								this.$refs.uToast.show({
									type: "warning",
									title: '昵称修改失败',
								})
							}
						}
					}).finally(()=>this.$refs.uModal.clearLoading())
				}else{
					this.$refs.uModal.clearLoading();
					this.$refs.uToast.show({
						type: "warning",
						title: '长度不能小于2',
					})
				}
			},
			setCity(params){
				let city = `${params.province.label} ${params.city.label}`;
				updateUser({"city":city}).then((res)=>{
					if(res.code == 200){
						if(res.data){
							this.user.city = city;
							this.$refs.uToast.show({
								type: "success",
								title: '修改成功！',
							})
						}else{
							this.$refs.uToast.show({
								type: "warning",
								title: '地区修改失败',
							})
						}
					}
				})
			},
			setTeam() {
				uni.navigateTo({
					url: "../teamSet/teamSet"
				})
			},
		}
	}
</script>

<style scoped>

.list{
	border-top: 8px solid #f7f7f7;
	border-bottom: 8px solid #f7f7f7;
}
.j-section{
	padding: 24rpx;
	display: flex;
	align-items: center;
	color: #fc0;
	font-size: 40rpx;
}
.j-section:active{
	background-color: #f7f7f7;
}
.right-box{
	display: flex;
	align-items: center;
}
.big-button{
	padding: 32rpx;
	color: #E6A23C;
	text-align: center;
	font-size: 16px;
	box-shadow: 0 3px 3px #d7d7d7;
}
.big-button:active{
	background-color: #f2f2f2;
}
.pop-wrap{
	width: 600rpx;
}
.pop-item{
	height: 90rpx;
	display: flex;
	border-bottom: 1px solid #f2f2f2;
	justify-content: center;
	align-items: center;
}
.pop-title{
	font-size: 10px;
	color: #666;
}
.pop-button{
	font-size: 16px;
}
.pop-button:active{
	background-color: #f7f7f7;
}
.section-wrap{
	width: 100%;
}
.slot-content{
	padding: 20rpx;
}
</style>
