<template>
	<view>
		<view v-if="flag">
			<view style="height: 0;">
				<view class="back"></view>
			</view>
			<view style="font-size: 38px;text-align: center;font-weight: bold;margin-top: 12rpx;color:#fff"
			>{{$moment().format("YYYY-MM-DD")}}</view>
			<view class="card">
				<view style="margin-top: -80rpx;"><u-avatar src="https://smallsmart.top/source/images/jgxq/icon/lxsp/we-logo.png" :size="160"></u-avatar></view>
				<view style="font-weight: bold;line-height: 56px;">
					<text>欢迎</text>
					<text style="font-size:56px">{{record.name}}</text>
				</view>
				<view style="line-height: 40px;">
					<text>您是今天第<text style="color: #32c696;font-size: 48px;font-weight: bold;">{{number}}</text>个</text>
				</view>
				<view style="margin-bottom:4px;margin-top: 8px;">从{{door?"腾飞门":"崇文门"}}扫码{{record.status > 2 ? "入" : "出"}}校的同学</view>
				<view class="greenImg" :class="record.status>2?'in-image':'out-image'"></view>
			</view>
			<view class="codeInfo" style="margin-top: 16rpx;">
				<view style="display: flex;align-items: flex-end;">
					<u-icon name="https://smallsmart.top/source/images/jgxq/icon/lxsp/xh.png" size="48"></u-icon>
					<text style="margin-left: 12rpx;">学号:</text>
				</view>
				<text>{{record.num}}</text>
			</view>
			<view class="codeInfo" style="margin-top: 68rpx;">
				<view style="display: flex;align-items: flex-end;">
					<u-icon name="https://smallsmart.top/source/images/jgxq/icon/lxsp/xy.png" size="48"></u-icon>
					<text style="margin-left: 12rpx;">学院:</text>
				</view>
				<text>{{record.academy}}</text>
			</view>
		</view>
		<view v-else>
			<view class="title">申请流程</view>
			<view class="time-line" v-if="record">
				<view class="time-line-item">
					<view class="left">
						<view class="node" 
						:class="record.status == 0 ? 'yellow' : record.status > 0 ? 'purple' : ''"></view>
						<view class="line"></view>
					</view>
					<view class="container" :data-id="1" @longpress="setStatus">
						<view class="justify bold">
							<text>申请</text>
						</view>
						<view class="justify time-thing">
							<text>申请人</text>
							<text class="info">{{record.name}}</text>
						</view>
						<view class="justify time-thing">
							<text>申请时间</text>
							<text class="info">{{record?$moment(record.applyTime).format("YYYY-MM-DD HH:mm:ss"):""}}</text>
						</view>
					</view>
				</view>
				<view class="time-line-item">
					<view class="left">
						<view class="node" 
						:class="record.status == 1 ? 'yellow' : record.status > 1 ? 'purple' : ''"></view>
						<view class="line"></view>
					</view>
					<view class="container border" :data-id="2" @longpress="setStatus">
						<view class="justify bold">
							<text>扫码离校</text>
							<text :class="record.status == 1?'purple-text':'disable'" 
							style="text-decoration: underline;" @click="leaveSchool">离校扫码</text>
						</view>
						<view class="justify time-thing">
							<text>扫码地点</text>
							<text v-if="record.status>1" class="info">{{record.leaveSite}}</text>
						</view>
						<view class="justify time-thing">
							<text>出校时间</text>
							<text v-if="record.status>1" class="info">{{$moment(record.leaveTime).format("YYYY-MM-DD HH:mm:ss")}}</text>
						</view>
					</view>
				</view>
				<view class="time-line-item">
					<view class="left">
						<view class="node" 
						:class="record.status == 2 ? 'yellow' : record.status > 2 ? 'purple' : ''"></view>
					</view>
					<view class="container border" :data-id="3" @longpress="setStatus">
						<view class="justify bold">
							<text>返校销假</text>
							<text :class="record.status == 2?'purple-text':'disable'" 
							style="text-decoration: underline;" @click="backSchool">返校扫码</text>
						</view>
						<view class="justify time-thing">
							<text>扫码地点</text>
							<text v-if="record.status>2" class="info">{{record.backSite}}</text>
						</view>
						<view class="justify time-thing">
							<text>返校时间</text>
							<text v-if="record.status>2" class="info">{{$moment(record.backTime).format("YYYY-MM-DD HH:mm:ss")}}</text>
						</view>
					</view>
				</view>
			</view>
			<view class="title">申请详情</view>
			<view class="detail">
				<view class="justify margin2">
					<text>学号</text>
					<text class="info">{{record.num}}</text>
				</view>
				<view class="justify margin2">
					<text>姓名</text>
					<text class="info">{{record.name}}</text>
				</view>
				<view class="justify margin2">
					<text>请假类型</text>
					<text class="info">市内当日离返校</text>
				</view>
				<view class="justify margin2">
					<text>出发时间</text>
					<text class="info">{{$moment().format("YYYY-MM-DD")}}</text>
				</view>
				<view class="justify margin2">
					<text>预计返校时间</text>
					<text class="info">{{$moment().format("YYYY-MM-DD")}}</text>
				</view>
				<view class="justify margin2">
					<text>外出地点</text>
					<text class="info">重庆市,重庆市,南岸区</text>
				</view>
				<view class="justify margin2">
					<text>外出事由</text>
					<text class="info">{{record.reason}}</text>
				</view>
			</view>
		</view>
		<u-modal v-model="modal" @confirm="showCode" ref="uModal" title="输入出校信息" mask-close-able show-cancel-button confirm-color="#9185ff">
			<view class="slot-content">
				<view class="u-padding-24">
					<u-input v-model="number" placeholder="出校人数" maxlength="5" />
					<view>
						<text>崇文门</text>
						<u-switch v-model="door"></u-switch>
						<text>腾飞门</text>
					</view>
				</view>
			</view>
		</u-modal>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				flag : false,
				record : null,
				number : null,
				door : false,
				modal : false,
			}
		},
		methods: {
			setStatus(e){
				let status = e.currentTarget.dataset.id;
				this.record.status = status;
				this.save();
			},
			save(){
				let list = uni.getStorageSync('lxsp_key');
				if(list && list.length > 0){
					let index = list.findIndex(item => item.id == this.record.id);
					list[index] = this.record;
					uni.setStorageSync('lxsp_key',list);
				}
			},
			leaveSchool(){
				if(this.record.status!=1) return;
				this.modal = true;
			},
			backSchool(){
				if(this.record.status!=2) return;
				this.modal = true;
			},
			showCode(){
				if(this.record.status == 1){
					this.record.leaveTime = new Date();
					this.record.leaveSite = this.door?'腾飞门':'崇文门';
				}else if(this.record.status == 2){
					this.record.backTime = new Date();
					this.record.backSite = this.door?'腾飞门':'崇文门';
				}
				this.record.status++;
				this.save();
				this.flag = true;
				uni.setNavigationBarTitle({
					title: "出入校管理——扫码"
				})
			}
		},
		onLoad(option) {
			let id = option.id;
			let list = uni.getStorageSync('lxsp_key');
			this.record = list.find(item=>item.id == id);
		},
		computed : {
		}
	}
</script>

<style scoped>
.purple-text{
	color: #9f8bea;
}
.disable{
	color: #dcdcdc;
}
.purple{
	background-color: #9f8bea!important;
}
.yellow{
	background-color: #ffcc63!important;
}
.title{
	background-color: #f7f7f7;
	color: #818181;
	display: flex;
	align-items: center;
	padding: 16rpx;
}
.time-line{
	padding-top: 64rpx;
	padding-left: 64rpx;
	border-top: 1px solid #eee;
	border-bottom: 1px solid #eee;
}
.node{
	border-radius: 50%;
	width: 32rpx;
	height: 32rpx;
	border: 2px solid #eee;
	background: #d8d8d8;
	flex-shrink : 0;
}
.justify{
	display: flex;
	justify-content: space-between;
}
.container{
	color: #888;
	padding-left: 0rpx;
	width: 100%;
	margin-left: 32rpx;
	margin-top: -16rpx;
	padding-bottom: 8rpx;
	margin-bottom: 16px;
	padding-right : 48rpx;
}
.bold{
	font-weight: bold;
	font-size: 16px;
	color: #777;
}
.info{
	color: #666;
	font-size: 13px;
}
.border{
	border-bottom: 1px solid #eee;
}
.time-line-item{
	display: flex;
}
.line{
	border-left: 2px solid #eee;
	height: 100%;
}
.left{
	display: flex;
	flex-direction: column;
	align-items: center;
}
.time-thing{
	margin: 12rpx 0;
}
.detail{
	font-size: 14px;
	color: #888;
	padding: 0 24rpx;
	border-top: 1px solid #eee ;
	border-bottom: 180px solid #eee ;
}
.margin2{
	margin: 24rpx 0;
}
.back{
	height: 280rpx;
	background-color: #9185ff;
}
.card{
	background-color: #fff;
	border-radius: 32rpx;
	box-shadow: 0 2px 8px rgb(56 56 56 / 10%);
	height: 680rpx;
	margin: 0 80rpx;
	margin-top: 80rpx;
	display: flex;
	flex-direction: column;
	align-items: center;
	color: #0e08ce;
	font-size: 20px;
	padding: 0 40rpx;
}
.greenImg{
	width: 100%;
	height: 240rpx;
	border-radius: 24rpx;
	background-position: 0 15%;
	background-size: cover;
	margin-top: 8rpx;
}
.in-image{
	background-image: url("https://smallsmart.top/source/images/jgxq/icon/lxsp/green.png");
}
.out-image{
	background-image: url("https://smallsmart.top/source/images/jgxq/icon/lxsp/outgreen.png");
}
.codeInfo{
	display: flex;
	margin: 0 32rpx;
	border-bottom: 1px solid #eee;
	justify-content: space-between;
	font-size: 20px;
	padding: 8rpx 0;
	color: #666;
}
</style>