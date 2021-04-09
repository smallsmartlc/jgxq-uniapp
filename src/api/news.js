import request from '@/utils/request'

export const getNewsById = (id) => request({
	method : 'get',
	url: `/news/${id}`,
});
export const getAuthorInfo = () => request({
    method: 'get',
    url: `/user/authorInfo`,
})