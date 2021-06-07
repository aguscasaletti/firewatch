import React from 'react'

export interface VideoSourceProps {
  src: string
}

const VideoSource: React.FC<VideoSourceProps> = ({ src }) => {
  return (
    <video autoPlay loop>
      <source src={src} type="video/mp4" />
    </video>
  )
}

export default VideoSource
