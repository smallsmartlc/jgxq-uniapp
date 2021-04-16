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
export const pageNewsByTag = (cur,pageSize,objectId,type) =>request({
    method: 'get',
    url: `/news/page/tag/${cur}/${pageSize}`,
    data:{
        objectId,
        type
    }
})
export const pageNewsByTags = (cur,pageSize,data) =>request({
    method: 'post',
    url: `/news/page/tags/${cur}/${pageSize}`,
    data
})
export const pageComment = (objId,cur,pageSize) => request({
    method : 'get',
    url: `/comment/0/${objId}/${cur}/${pageSize}`,
})