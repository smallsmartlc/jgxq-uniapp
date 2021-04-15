import request from '@/utils/request'

export const pageMatches = (params) => request({
    method: 'get',
    url: `/match/page`,
    data:params //pageNum,pageSize,start,teamId,past
})
export const homeMatches = (size,teamId) => request({
    method: 'get',
    url: `/match/home/${size}`,
    data : {teamId}
})
export const endMatches = (size) => request({
    method: 'get',
    url: `/match/end/${size}`
})
export const getMatchById = (id) => request({
    method: 'get',
    url: `/match/${id}`,
})