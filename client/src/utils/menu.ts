export function calculateXPosition(clientX: number, width: number) {
  const noAvailableWidth = clientX + width > window.innerWidth
  return noAvailableWidth ? window.innerWidth - width : clientX + width
}

export function calculateYPosition(clientY: number, height: number) {
  return clientY - 100 + height >= window.innerHeight
    ? window.innerHeight - height - 100
    : clientY - 100
}
