import snakeCase from 'lodash/snakeCase'
import mapKeys from 'lodash/mapKeys'

import { Alert, Camera } from 'types/domain'
import { axiosInstance } from 'utils/axiosInstance'
import { Paginable } from 'types/data-table'

export const fetchAlertsPendingReview = async (): Promise<Alert[]> => {
  const searchParams = new URLSearchParams({
    status: 'pending_review',
  })
  const response = await axiosInstance.get<Alert[]>(
    `/alerts?${searchParams.toString()}`,
  )
  return response.data
}

export const fetchAllAlerts = async (): Promise<Alert[]> => {
  const response = await axiosInstance.get<Alert[]>(`/alerts`)
  return response.data
}

export const fetchAlertByID = async (id: number): Promise<Alert> => {
  const response = await axiosInstance.get<Alert>(`/alerts/${id}`)
  return response.data
}

export const fetchCameras = async (): Promise<Camera[]> => {
  const response = await axiosInstance.get<Paginable<Camera>>(`/cameras`)
  return response.data.data
}

export const updateAlert =
  (id: number) =>
  async (carrier: Record<string, unknown>): Promise<Alert> => {
    const response = await axiosInstance.put<Alert>(
      `/alerts/${id}`,
      mapKeys(carrier, (_, k) => snakeCase(k)),
    )
    return response.data
  }
