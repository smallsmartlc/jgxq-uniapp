import request from '@/utils/request'

export const getUserInfo = (data) => request({
    method: 'get',
    url: `/user/info`,
    data : data
})
export const getFocusUser = (data) => request({
    method: 'get',
    url: `/user/page/focus`,
    data : data
})
export const getFansUser = (data) => request({
    method: 'get',
    url: `/user/page/fans`,
    data : data
})
export const pageMessage = (pageNum,pageSize) => request({
    method: 'get',
    url: `/message`,
    data :{
        pageNum,pageSize
    }
})
export const getCollectNews = (pageNum,pageSize) => request({
    method: 'get',
    url: `/user/page/collect`,
    data :{
        pageNum,pageSize
    }
})
export const updateHomeTeam = (teamId)=>request({
    method:"put",
    url : `/user/homeTeam/${teamId}`
})
export const updateUser = (data)=>request({
    method:"put",
    url : `/user/info`,
    data,
})
export const focusUser = (target,focused)=>request({
    method:"put",
    url : `/focus`,
    data : {
        target,
        focused
    }
})
