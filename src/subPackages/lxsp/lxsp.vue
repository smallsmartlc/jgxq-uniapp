<template>
	<view>
		<view class="title" @click="addPop=true">
			<u-icon name="https://smallsmart.top/source/images/jgxq/icon/lxsp/lxsp.png" size="100"></u-icon>
			<text class="purple" style="margin-left: 16rpx;font-size: 34px;">申报入口</text>
		</view>
		<view class="sqjl">申请记录<span style="width: 24rpx;"></span>(-条)</view>
		<view class="records">
			<view class="record_item" v-for="(item,index) in records" :data-id="item.id" @longpress="removeRecord">
				<view class="gap"></view>
				<view class="container">
					<view class="justify name">
						<view>{{item.name}}</view>
						<view class="purple">{{item.status==1?"待出校":item.status==2?"待入校":"结束"}}</view>
					</view>
					<view class="justify item">
						<view>外出时间</view>
						<view>{{$moment().subtract(index,"days").format("YYYY-MM-DD")}}</view>
					</view>
					<view class="justify item">
						<view>外出地点</view>
						<view>{{item.site}}</view>
					</view>
					<view class="justify item">
						<view>预计回校时间</view>
						<view>{{$moment().subtract(index,"days").format("YYYY-MM-DD")}}</view>
					</view>
					<view class="justify item">
						<view>更新时间</view>
						<view v-if="item.status == 1">{{$moment(item.applyTime).format("YYYY-MM-DD HH:mm:ss")}}</view>
						<view v-else-if="item.status == 2">{{$moment(item.leaveTime).format("YYYY-MM-DD HH:mm:ss")}}</view>
						<view v-else>{{$moment(item.backTime).format("YYYY-MM-DD HH:mm:ss")}}</view>
					</view>
				</view>
				<view class="button purple" :data-id="item.id" @click="toDetail">详情</view>
			</view>
		</view>
		<u-modal v-model="addPop" @confirm="addRecord" ref="uModal" title="输入" mask-close-able show-cancel-button confirm-color="#9185ff">
			<view class="slot-content">
				<view class="u-padding-24">
					<u-input v-model="record.name" placeholder="姓名" maxlength="4" />
					<u-input v-model="record.num" placeholder="学号" maxlength="10" />
					<u-input v-model="record.academy" placeholder="学院" maxlength="10" />
					<u-input v-model="record.reason" placeholder="事由" maxlength="10" />
					<u-input v-model="record.site" placeholder="外出地点" maxlength="10" />
				</view>
			</view>
		</u-modal>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				records : null,
				record:{
					num : null,
					name : "",
					academy : "",
					site : "",
					reason : "",
				},
				addPop : false,
			}
		},
		methods: {
			addRecord(){
				let id = this.records.length > 0?this.records[0].id + 1:1; 
				let temp = {
					...this.record,
					id : id,
					status : 1,
					applyTime : new Date(),
					leaveTime : null,
					backTime : null,
					leaveSite : "",
					backSite : "",
				}
				this.records.unshift(temp);
				this.save()
			},
			removeRecord(e){
				let id = e.currentTarget.dataset.id;
				this.records.splice(this.records.findIndex(item => item.id === id),1);
				this.save();
			},
			refresh(){
				let list = uni.getStorageSync('lxsp_key');
				this.records = list || [];
				if(list && list.length > 0){
					const {num,name,academy,site,reason} = list[0];
					this.record = {num,name,academy,site,reason};
				}
			},
			save(){
				uni.setStorageSync('lxsp_key',this.records);
			},
			toDetail(e){
				let id = e.currentTarget.dataset.id;
				uni.navigateTo({
					url: `/subPackages/lxsp/lxspDetail?id=${id}`
				})
			}
		},
		onShow() {
			this.refresh();
		}
	}
</script>

<style scoped>
.purple{
	color: #9185ff;
}
.title{
	display: flex;
	align-items: center;
	justify-content: center;
	background-color: #f0f9f6;
	font-weight: bold;
	padding: 24rpx;
}
.title:active{
	background-color: #fff;
}
.sqjl{
	font-size:15px;
	height: 0;
	display: flex;
	align-items: center;
	padding-left: 20rpx;
}
.justify{
	display: flex;
	justify-content: space-between;
}
.gap{
	background-color: #f7f7f7;
	height: 20rpx;
}
.record_item{
	border-top: 1px solid #eee;
	border-bottom: 1px solid #eee;
}
.container{
	color: #aeaeae;
	padding: 6rpx 32rpx;
	font-size: 14px;
	border-top: 1px solid #eee;
	border-bottom: 1px solid #eee;
}
.container .name{
	font-size: 16px;
	margin-top: 20rpx;
	color: #818181;
}
.container .item{
	font-size: 14px;
	margin: 20rpx 0;
}
.button{
	padding: 24rpx;
	display: flex;
	align-items: center;
	justify-content: center;
}
.button:active{
	background-color: #E7E7E7;
}
</style>
