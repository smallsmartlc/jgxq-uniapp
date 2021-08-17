import request from '@/utils/request'

export const checkAudit = () => request({
    method: 'get',
    url: `/audit/qq`,
})