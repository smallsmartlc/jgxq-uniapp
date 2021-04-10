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
export function editor2Text(str){
    if(str){
        return str.replace(/<[^>]+>|&[^>]+;/g,"").replace(/<img.*?(?:>|\/>)/gi,"[图片]").trim();
    }else return "";
}
export function getMatchStatus(time){
	var diff = moment().diff(moment(time),'minute');
	return diff>120?'已结束':diff > 0?'进行中':'未开始';
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