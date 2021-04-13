import * as $utils from '@/utils/common'

export function getUserInfo(){
	return uni.getStorageSync("userInfo");
}
export function setUserInfo(user){
	uni.setStorageSync("userInfo",user);
}
export function getHomeTeam(){
	return uni.getStorageSync("userInfo").homeTeam;
}
export function setHomeTeam(team){
	// userInfo
	let u = uni.getStorageSync("userInfo");
	if(u){
		u.homeTeam = team;
		uni.setStorageSync("userInfo",u);
	}
	// 导航栏
	let img,selectImg;
	if(team){
		img = $utils.url2img(team.logo);
		selectImg = img;
	}else {
		img = "https://smallsmart.top/source/images/jgxq/icon/football.png";
		selectImg = "https://smallsmart.top/source/images/jgxq/icon/colorball.png";
	}
	getApp().globalData.tabbar[2].iconPath = img;
	getApp().globalData.tabbar[2].selectedIconPath = selectImg;
}