export function timeSince(date: Date): string {
  // get the difference in seconds
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000)

  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60
  }

  let intervalType: string = ''
  let timePassed: number = 0

  for (const [type, secondsPerInterval] of Object.entries(intervals)) {
    timePassed = Math.floor(seconds / secondsPerInterval)
    if (timePassed >= 1) {
      intervalType = type
      break
    }
  }

  if (!intervalType) {
    return 'just now'
  }

  return `${timePassed}${intervalType.charAt(0)}`
}
