<template>
	<scroll-view scroll-y style="width: 100%;height: 100%;" @scrolltolower="onreachBottom">
		<view v-for="item in users" :key="item.userkey">
			<UserBox @toast="showToast" :user="item"></UserBox>
		</view>
		<u-toast ref="uToast" />
	</scroll-view>
</template>

<script>
	import UserBox from '@/components/UserBox.vue'
	import {getFansUser} from '@/api/user'
	export default {
		components:{UserBox},
		data() {
			return {
				users: [],
				total: 1,
				cur: 0,
				pageSize: 10,
				loading: false,
				loadText : {
					loadmore: '加载更多',
					loading: '经管雄起正在加载',
					nomore: '没有更多了'
				},
			}
		},
		mounted() {
			this.load();
		},
		props: {
			user: Object,
		},
		methods: {
			onreachBottom() {
				this.load();
			},
			load() {
				if(this.disabled) return;
				this.loading = true
				this.cur++;
				getFansUser({pageNum:this.cur,pageSize:this.pageSize,target : this.user.userkey})
				.then((res)=>{
					if(res.code == 200){
						var temp = res.data.records;
						this.total = res.data.total;
						this.users = this.users.concat(temp);
					}else{this.cur--;}
				})
				this.loading = false
			},
			showToast(data){
				this.$refs.uToast.show(data);
			},
		},
		computed: {
			noMore() {
				return this.users.length >= this.total
			},
			disabled() {
				return this.loading || this.noMore
			},
			loadingStatus(){
				return this.loading?'loading':this.noMore?'nomore':'loadmore'
			},
		},
	}
</script>

<style>
</style>
