<template>
	<view>
		<view class="search-box">
			<u-search @search="reloadTeam()" @custom="reloadTeam()" @clear="reloadTeam()" clearabled placeholder="搜索球队"
				v-model="keyword"></u-search>
		</view>
		<view class="box_wrap">
			<view class="teamItem" v-for="item in teams" :key="item.id">
				<view @click="focusThis(item.id)" style="position:relative">
					<view class="imgbox" :class="focus===item.id?'isactive':''">
						<u-image :src="$utils.url2img(item.logo)" height="90" width="90" img-mode="aspectFill">
						</u-image>
					</view>
					<view v-if="focus===item.id" class="badge">
						<u-icon name="checkbox-mark"></u-icon>
					</view>
				</view>
				<view class="name">{{item.name}}</view>
			</view>
		</view>
		<view class="footer">
			<u-button :loading="bLoading" :disabled="!focus" shape="circle" @click="addTeam" type="primary">选好了</u-button>
		</view>
		<u-toast ref="uToast" />
	</view>
</template>

<script>
	import {
		pageTeams
	} from '@/api/team';
	import {updateHomeTeam} from '@/api/user'
	import {setHomeTeam} from '@/utils/store.js'
	export default {
		data() {
			return {
				keyword: "",
				teams: [],
				cur: 0,
				size: 18,
				total: 1,
				loading: false,
				focus: null,
				bLoading : false,
			}
		},
		onLoad() {
			this.loadTeam();
		},
		onReachBottom() {
			this.loadTeam();
		},
		onPullDownRefresh() {
			this.reloadTeam();
			uni.stopPullDownRefresh();
		},
		methods: {
			loadTeam() {
				if (this.disabled) return;
				this.loading = true
				this.cur++;
				pageTeams(this.cur, this.size, {
					sort: 'HEAT',
					keyword: this.keyword
				}).then((res) => {
					if (res.code == 200) {
						var temp = res.data.data;
						this.total = res.data.total
						this.teams = this.teams.concat(temp);
					} else this.cur--;
					this.loading = false;
				})
			},
			reloadTeam() {
				if (this.loading) return;
				this.cur = 0;
				this.teams.splice(0, this.teams.length);
				this.loadTeam();
			},
			focusThis(id) {
				if (this.focus == id) {
					this.focus = null
				} else {
					this.focus = id;
				}
			},
			addTeam() {
				if (!this.focus) {
					return;
				}
				this.bLoading = true;
				updateHomeTeam(this.focus).then((res) => {
					if (res.code == 200) {
						if (res.data) {
							let team = this.teams.find((item)=>{
								return item.id == this.focus;
							})
							setHomeTeam(team);
							this.$refs.uToast.show({
								type: "success",
								title: "主队更新成功!",
								back : true,
							})
						} else {
							this.$refs.uToast.show({
								type: "error",
								message: '更新失败,检查主队是否选择正确',
							})
						}
					} else {
						this.$refs.uToast.show({
							type: "error",
							message: res.msg,
						})
					}
					this.bLoading = false;
				})
			},
		},
		computed: {
			noMore() {
				return this.teams.length >= this.total
			},
			disabled() {
				return this.loading || this.noMore
			}
		}
	}
</script>

<style>
	.search-box {
		padding: 20rpx 40rpx;
		border-bottom: 1px solid #e7e7e7;
	}

	.box_wrap {
		display: flex;
		flex-wrap: wrap;
		align-content: space-between;
		width: 660rpx;
		margin: 0 auto;
	}

	.isactive {
		border: 2px solid #fc0 !important;
		background-color: rgba(255, 204, 0, 0.2) !important;
	}

	.teamItem {
		width: 200rpx;
		margin: 10rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.teamItem .name {
		max-width: 140rpx;
		font-size: 10px;
		line-height: 16px;
		text-align: center;
	}

	.teamItem .imgbox {
		border: 2px solid #fff;
		background-color: #f2f2f2;
		border-radius: 50%;
		padding: 10px;
		cursor: pointer;
		width: 90rpx;
		height: 90rpx;
		box-sizing: content-box;
	}

	.footer {
		position: fixed;
		bottom: 40rpx;
		left: 0;
		width: 750rpx;
		padding: 0 200rpx;
	}

	.badge {
		position: absolute;
		bottom: 0;
		right: 0;
		background-color: #fc0;
		color: #fff;
		width: 40rpx;
		height: 40rpx;
		border-radius: 50%;
		text-align: center;
	}
</style>
