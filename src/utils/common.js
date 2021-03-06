import { imgUrl } from '@/constants/index'
import moment from 'moment'

export function isEmpty(str){
    if(typeof str == "undefined" || str == null || str == ""){
        return true;
    }else{
        return false;
    }
}
export function url2img(str){
    if(str){return imgUrl + str;}
    else{
        var defaultimg = require('@/static/default_image.png')
        return defaultimg; 
    } 
}
export function tabbarImg(str,select){
	if(str){return imgUrl + str;}
	else{
		let defaultimg;
		if(select){
			defaultimg = "https://smallsmart.top/source/images/jgxq/icon/colorball.png";
		}else{
			defaultimg = "https://smallsmart.top/source/images/jgxq/icon/football.png"
		}
	    return defaultimg; 
	}
}
export function editor2Text(str){
    if(str){
        return str.replace(/<[^>]+>|&[^>]+;/g,"").replace(/<img.*?(?:>|\/>)/gi,"[图片]").trim();
    }else return "";
}
export function getMatchStatus(time){
	var diff = moment().diff(moment(time),'minute');
	if(diff>=0){
		return diff>120?'已结束':'进行中';
	}else{
		return '未开始';
	}
}
export function getDayStr(time){
	return moment(time).calendar(null,{
		sameDay : '[今天]',
		nextDay : '[明天]',
		nextWeek : 'MM-DD',
		lastDay : 'MM-DD',
		lastWeek : 'MM-DD',
		sameElse : 'MM-DD'
	});
}

export function fromNowStr(time){
	var now = moment();
	var temp =  moment(time);
	var diff = now.diff(temp,'day');
	if(now.year() == temp.year()){
		if((now-temp) > (3*24*3600*1000)){
			return temp.format('M-DD HH:mm');
		}else{
			return temp.fromNow();
		}
	}else{
		return temp.format('YYYY-MM-DD HH:mm');
	}
}
export function matchTimeFormat(time){
	var now = moment();
	var temp =  moment(time);
	if(now.year() == temp.year()){
		return temp.format('MM-DD HH:mm');
	}else{
		return temp.format('YYYY-MM-DD HH:mm');
	}
}
export function iframe2Text(text){
	if(text){
		let bilibiliId = "wx7564fd5313d24844"; //默认微信
		// #ifdef MP-QQ
		bilibiliId = "1109937557";
		// #endif
		return text.replace(/<iframe src="[\s\S]+aid=(\d+)&[\s\S]+"[\s\S]+<\/iframe>/g,(match,capture)=>{
			return `<br><view style='margin: 20rpx 0;'>
						<a app-id="${bilibiliId}" path='pages/video/video?avid=${capture}' style='color:#fb7299'>点击查看视频</a>
					</view>`
		})
		// return text.replace(/<iframe src="(\S+)"[\s\S]+<\/iframe>/g,"<br><view style='text-align: center;margin: 20rpx 0;'>小程序不支持b站视频播放,<a href='$1' style='color:#fb7299'>点击复制链接</a></view>")
	}else return "";
}
export function prewImage(url){
	var imgArr = [];
	imgArr.push(url2img(url));
	//预览图片
	uni.previewImage({
		urls: imgArr,
		current: imgArr[0]
	});
}
export function audit(){
	// #ifdef MP-QQ
	let audit =  getApp().globalData.audit;
	if(audit){
		return false
	}
	// #endif
	return true;
}