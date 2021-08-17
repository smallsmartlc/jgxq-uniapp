<script>
	import '.env.js';
	import {
		setUserInfo
	} from '@/utils/store.js'
	import {checkUser} from '@/api/login'
	import {checkAudit} from '@/api/audit'
	export default {
		globalData: {
			...process.uniEnv,
			tabbar: [{
					iconPath: "file-text",
					selectedIconPath: "file-text-fill",
					text: '首页',
					customIcon: false,
					pagePath: "/pages/index/index"
				},
				{
					iconPath: "play-circle",
					selectedIconPath: "play-circle-fill",
					text: '比赛',
					customIcon: false,
					pagePath: "/pages/match/match"
				},
				{
					iconPath: "https://smallsmart.top/source/images/jgxq/icon/football.png",
					selectedIconPath: "https://smallsmart.top/source/images/jgxq/icon/colorball.png",
					text: '主队',
					midButton: true,
					customIcon: false,
					pagePath: "/pages/myTeam/myTeam"
				},
				{
					iconPath: "chrome-circle-fill",
					selectedIconPath: "chrome-circle-fill",
					text: '闲聊',
					customIcon: false,
					pagePath: "/pages/talk/talk"
				},
				{
					iconPath: "home",
					selectedIconPath: "home-fill",
					text: '我的',
					customIcon: false,
					pagePath: "/pages/user/user"
				},
			],
			userInfo: null,
			audit : false,
		},
		onLaunch: function() {
			// app启动时加载
			// 导航栏
			this.checkUser();
			// #ifdef MP-QQ
			this.checkAudit();
			// #endif
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		},
		methods:{
			checkUser() {
				checkUser().then((res) => {
					if (res.code == 200) {
						if(res.data){
							setUserInfo(res.data);
						}
					}
				})
			},
			checkAudit(){
				checkAudit().then((res)=>{
					if (res.code == 200) {
						if(res.data){
							getApp().globalData.audit = true;
						}else {
							getApp().globalData.audit = false;
						}
					}
				})
			}
		}
	}
</script>
<style>
	/*  #ifdef MP-QQ  */
	.qq-display{
		display: none;
	}
	/*  #endif  */
</style>
<style lang="scss">
	/*每个页面公共css */
	@import "./static/iconfont.css";
	@import "uview-ui/index.scss";
</style>
