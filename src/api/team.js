import request from '@/utils/request'

export const getTeamById = (teamId) => request({
    method: 'get',
    url: `/team/infos/${teamId}`,
})
export const getBasicTeamById = (teamId) => request({
    method: 'get',
    url: `/team/${teamId}`,
})
export const pageTeams = (cur,size,data)=>request({
    method : 'get',
    url: `/team/page/${cur}/${size}`,
    data
})