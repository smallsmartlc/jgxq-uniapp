<script>
	import '.env.js' 
	export default {
		globalData: process.uniEnv,
		onLaunch: function() {
			// app启动时加载
			// 导航栏
			uni.setStorage({
				key: "tabbar",
				data: [{
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
						iconPath: "https://smallsmart.top/static/img/jgxq.9a2351c.png",
						selectedIconPath: "https://smallsmart.top/static/img/jgxq.9a2351c.png",
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
			})
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style lang="scss">
	/*每个页面公共css */
	@import "./static/iconfont.css";
	@import "uview-ui/index.scss";
</style>
