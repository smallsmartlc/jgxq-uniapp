import request from '@/utils/request'

export const getNewsById = (id) => request({
	method : 'get',
	url: `/news/${id}`,
});
export const homeNews = ()=>request({
    method : "get",
    url: `/news/home/top`,
})
export const pageNews = (cur,pageSize,params) =>request({
    method: 'get',
    url: `/news/page/${cur}/${pageSize}`,
    data:params // keyword,topNews
})