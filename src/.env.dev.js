var flag = false;
const UNI_APP = flag?{  
	VUE_APP_BASE_API : 'https://smallsmart.top/api',
	VUE_APP_IMG_URL : 'https://smallsmart.top/source/'
} : {
	
	VUE_APP_BASE_API : 'http://localhost:6800',
	VUE_APP_IMG_URL : 'http://localhost:9916/'
}

module.exports = UNI_APP;