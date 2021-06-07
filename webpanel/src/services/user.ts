import { axiosInstance, cerberusAxiosInstance } from 'utils/axiosInstance'
import { Route, UserInfo } from 'types/domain'

export const fetchCurrentUserInfo = async (): Promise<UserInfo> => {
  const response = await axiosInstance.get<UserInfo>('/users/me/userinfo')
  return response.data
}
