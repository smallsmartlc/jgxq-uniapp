import * as $utils from '@/utils/common'

export function getUserInfo(){
	
}
export function setUserInfo(user){
	getApp().globalData.userInfo = user;
	if(user.homeTeam){
		setTabbar(user.homeTeam.logo);
	}else{
		setTabbar(null);
	}
}
export function getHomeTeam(){
	
}
export function setHomeTeam(team){
	// userInfo
	let u = getApp().globalData.userInfo;
	if(getApp().globalData.userInfo){
		getApp().globalData.userInfo.homeTeam = team;
		if(team){
			setTabbar(team.logo);
		}else{
			setTabbar(null);
		}
	}
}
export function setTabbar(img){
	// 设置导航栏
	getApp().globalData.tabbar[2].iconPath = $utils.tabbarImg(img);
	getApp().globalData.tabbar[2].selectedIconPath = $utils.tabbarImg(img,true);
}