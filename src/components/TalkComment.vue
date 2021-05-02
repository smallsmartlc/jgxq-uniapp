<template>
	<view class="reply-wrap">
		<view>
			<ReplyItem @delete="deleteComment" @reply="addReply" :item="thisComment"></ReplyItem>
		</view>
		<block v-for="(item,index) in thisComment.replyList" :key="item.id">
			<ReplyItem @delete="deleteReply(index)" @reply="addReply" :item="item" :reply="thisComment.userkey"></ReplyItem>
		</block>
	</view>
</template>

<script>
	import ReplyItem from "./ReplyItem.vue"
	export default {
		name:"TalkComment",
		components:{ReplyItem},
		data() {
			return {
				thisComment : this.comment
			};
		},
		props:{
			comment : Object,
		},
		methods:{
			deleteReply(index){
				this.thisComment.replyList.splice(index,1);
			},
			deleteComment(){
				this.$emit("delete");
			},
			addReply(data){
				this.thisComment.replyList.push(data);
			}
		}
	}
</script>

<style scoped>
.reply-wrap{
	font-size: 12px;
	line-height: 20px;
}
</style>
