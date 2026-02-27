function extractYouTubeId(url) {
  const patterns = [
    /youtube\.com\/watch\?v=([^&]+)/,
    /youtu\.be\/([^?&]+)/,
    /youtube\.com\/embed\/([^?&]+)/,
  ]
  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match) return match[1]
  }
  return null
}

function extractVimeoId(url) {
  const match = url.match(/vimeo\.com\/(?:video\/)?(\d+)/)
  return match ? match[1] : null
}

function extractGoogleDriveId(url) {
  const patterns = [/drive\.google\.com\/file\/d\/([^/]+)/, /drive\.google\.com\/open\?id=([^&]+)/]
  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match) return match[1]
  }
  return null
}

export function getEmbedUrl(videoUrl) {
  if (!videoUrl) return ''

  const youtubeId = extractYouTubeId(videoUrl)
  if (youtubeId) return `https://www.youtube.com/embed/${youtubeId}`

  const vimeoId = extractVimeoId(videoUrl)
  if (vimeoId) return `https://player.vimeo.com/video/${vimeoId}`

  const driveId = extractGoogleDriveId(videoUrl)
  if (driveId) return `https://drive.google.com/file/d/${driveId}/preview`

  return videoUrl
}

