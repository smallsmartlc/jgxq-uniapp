<template>
	<scroll-view scroll-y style="width: 100%;height: 100%;" @scrolltolower="onreachBottom">
		<block v-for="(item,index) in talks" :key="item.id">
			<TalkBox @toast="showToast" @delete="deleteTalk(index)" v-model="talks[index]" ></TalkBox>
		</block>
		<u-loadmore :status="loadingStatus" :load-text="loadText" />
		<u-toast ref="uToast" />
	</scroll-view>
</template>

<script>
	import TalkBox from '@/components/TalkBox.vue'
	import {pageTalkList} from '@/api/talk'
	export default {
		components: {
			TalkBox
		},
		data() {
			return {
				talks: [],
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
				pageTalkList({pageNum:this.cur,pageSize:this.pageSize,target : this.user.userkey})
				.then((res)=>{
				    if(res.code == 200){
				  	  var temp = res.data.records;
				  	  this.total = res.data.total;
				  	  this.talks = this.talks.concat(temp);
				    }else{this.cur--;}
				})
				this.loading = false
			},
			showToast(data){
				this.$refs.uToast.show(data);
			},
			deleteTalk(index){
				this.talks.splice(index,1);
				this.$refs.uToast.show({
					title: '已删除!',
					type: 'success'
				});
			},
		},
		computed: {
			noMore() {
				return this.talks.length >= this.total
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

<style scoped>
</style>
