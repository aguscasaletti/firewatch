export type AlertStatus =
  | 'pending_review'
  | 'discarded'
  | 'confirmed'
  | 'finalized'

export type CameraStatus = 'ok' | 'warning' | 'fire_in_progress'

export interface Route {
  routes: string[]
  label: string
}

export interface UserInfo {
  id: number
  username: string
  email?: string
  name?: string
  lastName?: string
  applicationName: string
}

export interface Camera {
  id: number
  name: string
  status: CameraStatus
  location_lat: number
  location_lng: number
  video_source_url: string
}

export interface Alert {
  id: number
  status: AlertStatus
  location_lat: number
  location_lng: number
  details: string
  camera_id: number
  camera: Camera
  created_date: string
  image_capture?: string
}
