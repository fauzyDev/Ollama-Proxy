export function logger(message: string, data?: unknown) {
  const now = new Date()
  const time = now.toLocaleString('id-ID', {
    timeZone: 'Asia/Jakarta',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  })
  
  console.log(`[${time}] ${message}`)

  if (data) {
    console.log(data)
  }
}