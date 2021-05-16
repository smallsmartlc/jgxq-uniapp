<template>
	<view>
		<view class="container">
			<TalkEditor @toast="showToast" @success="addTalk"></TalkEditor>
		</view>
		<view>
			<block v-for="(item,index) in talks" :key="item.id">
				<TalkBox @toast="showToast" @delete="deleteTalk(index)" :talk="item"></TalkBox>
			</block>
			<u-loadmore :status="loadingStatus" :load-text="loadText" />
		</view>
		<u-tabbar active-color="#fc0" :list="tabbar" :mid-button="true"></u-tabbar>
		<u-toast ref="uToast" />
	</view>
</template>

<script>
	import {
		pageTalk
	} from '@/api/talk'
	import TalkEditor from './TalkEditor.vue'
	import TalkBox from '@/components/TalkBox.vue'
	export default {
		data() {
			return {
				tabbar: null,
				loading: false,
				total: 1,
				pageSize: 10,
				cur: 0,
				talks: [],
				loadText: {
					loadmore: '加载更多闲聊',
					loading: '经管雄起正在加载',
					nomore: '没有更多了'
				},
			}
		},
		components: {
			TalkEditor,TalkBox
		},
		onLoad() {
			this.load();
		},
		onShow() {
			// 加载导航栏参数
			this.tabbar = getApp().globalData.tabbar;
		},
		onReachBottom() {
			this.load();
		},
		onPullDownRefresh() {
			this.talks = [];
			this.cur = 0;
			this.load()
			uni.stopPullDownRefresh();
		},
		methods: {
			addTalk(data) {
				this.talks.unshift(data);
				this.total++;
			},
			load(){
				if(this.disabled) return;
				this.loading = true;
				this.cur++;
				pageTalk(this.cur, this.pageSize).then((res) => {
					if (res.code == 200) {
						this.total = res.data.total;
						this.talks = this.talks.concat(res.data.records);
					}else{
						this.cur--;
					}
					this.loading = false;
				})
			},
			deleteTalk(index){
				this.talks.splice(index,1);
				this.$refs.uToast.show({
					title: '已删除!',
					type: 'success'
				});
			},
			showToast(data){
				this.$refs.uToast.show(data);
			}
		},
		computed: {
			noMore() {
				return this.talks.length >= this.total
			},
			disabled() {
				var val = this.loading || this.noMore;
				return val;
			},
			loadingStatus() {
				return this.loading ? 'loading' : this.noMore ? 'nomore' : 'loadmore'
			},
		}
	}
</script>

<style scoped>
	.container {
		padding: 16rpx;
	}
</style>
