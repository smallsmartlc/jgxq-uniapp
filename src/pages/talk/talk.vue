<template>
	<view>
		<view class="container">
			<TalkEditor @success="addTalk(item)"></TalkEditor>
		</view>
		<view>
			<block v-for="item in talks" :key="item.id">
				<TalkBox :talk="item"></TalkBox>
			</block>
		</view>
		<u-tabbar active-color="#fc0" :list="tabbar" :mid-button="true"></u-tabbar>
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
		methods: {
			addTalk(item) {

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
