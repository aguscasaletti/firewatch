import { axiosInstance } from 'utils/axiosInstance'
import { UserInfo } from 'types/domain'

export const fetchCurrentUserInfo = async (): Promise<UserInfo> => {
  const response = await axiosInstance.get<UserInfo>('/users/me/userinfo')
  return response.data
}
