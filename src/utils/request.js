import {BaseUrl} from "@/constants/index.js"
import * as utils from './common.js'


var http = (option) => {
	return new Promise((resolve, reject) => {
		uni.request({
			url: BaseUrl + option.url,
			method: option.method,
			data: option.data,
			header: {
				'Content-type': 'application/json;charset=UTF-8',
				// #ifndef H5
				// 假cookie
				'cookie': uni.getStorageSync("authCookie") || ''
				// #endif
			},
			timeout: 10000,
			// #ifdef H5
			// 真cookie
			withCredentials: true,
			// #endif
			success(res) {
				if (res.statusCode != 200) {
					const error = res.data;
					if (error && !utils.isEmpty(error.status)) {
						// 400,500异常处理，统一提示错误消息
						if (error.status === 500 || error.status === 400) {
							// Message({
							// 	message: error.message || '服务器异常，请联系管理员',
							// 	type: 'error',
							// 	duration: messageTime
							// })  
							uni.showModal({
							    title: '提示',
							    content: error.message || '服务器异常，请联系管理员',
								showCancel : false
							});
						}
						if (error.status === 401) {
							getApp().globalData.userInfo = null;
							// 警告弹窗 请先登陆再操作
							uni.showModal({
							    title: '提示',
							    content: '登陆后才能操作呢',
								success: function(res) {
									if (res.confirm) {
										uni.navigateTo({
											url: "/pages/login/login"
										});
									}
								},
							});
							
						}
						if (error.status === 403) {
							// Message({
							// 	message: '没有作者权限,去申请成为创作者吧!!!',
							// 	type: 'warning'
							// });
						}
						let errorInfo = error.message ? error.message : error.error;
						reject(errorInfo);
					}
				} else {
					//设置Cookie
					// #ifndef H5
					let cookie = res.cookies?res.cookies[0]:null;
					if(cookie){
						uni.setStorageSync("authCookie",cookie);
					}
					// #endif
					// #ifdef MP-QQ
					console.log(res)
					let qqCookie = null;
					if(res.data){
						if(res.data.data) {
							qqCookie = res.data.data.token;	
						}
					}
					if(qqCookie){
						uni.setStorageSync("authCookie",qqCookie);
					}
					
					// #endif
					const data = res.data
					if (data && data.code === '200') {
						data.code = 200
					}
					resolve(data);
				}
			},
			fail(error) {
				// 服务器异常
				reject(error);
			},
			complete() {
				uni.hideLoading();
			}
		})
	})
}
export default http
