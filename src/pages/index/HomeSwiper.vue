<template>
	<view style="border-bottom: 4px solid #F2F2F2;">
		<u-swiper :list="news" title height="300" mode="rect" @click="toDetail" border-radius="0"></u-swiper>
	</view>
</template>

<script>
	export default {
	    props:{
	        news:Array,
	    },
	    data() {
	        return {
	        }
	    },
		methods:{
			toDetail(index){
				uni.navigateTo({
					url:`/subPackages/newsDetail/newsDetail?id=${this.news[index].id}`
				})
			}
		}
	} 
</script>

<style>
</style>
