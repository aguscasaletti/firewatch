import { Camera } from 'types/domain'

import video1 from 'assets/20200812 Lake Fire detection via model3 (HPWREN camera Wilson North) - trimmed.mp4'
import video2 from 'assets/20210528 Otay Mountain South (om-s) model 11 - trimmed.mp4'
import video3 from 'assets/far away smoke - trimmed.mp4'

export const mockedCameras: Camera[] = [
  {
    id: 300,
    location_lat: 23,
    location_lng: 22,
    name: 'Córdoba - Calamuchita',
    status: 'ok',
    video_source_url: '.mp4',
  },
  {
    id: 301,
    location_lat: 23,
    location_lng: 22,
    name: 'Córdoba - Punilla',
    status: 'ok',
    video_source_url: '.mp4',
  },
  {
    id: 302,
    location_lat: 23,
    location_lng: 22,
    name: 'Córdoba - Altas cumbres',
    status: 'warning',
    video_source_url: '.mp4',
  },
  {
    id: 303,
    location_lat: 23,
    location_lng: 22,
    name: 'Córdoba - Altas cumbres',
    status: 'ok',
    video_source_url: '.mp4',
  },
]

export const mockedVideos: Record<string, string> = {
  300: video1,
  301: video2,
  302: video3,
  303: video2,
}
