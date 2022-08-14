export const getNewSNID = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  return randomStr(15, chars)
}

const randomStr = (length: number, strSet: string): string => {
  let rand_str = ''
  for (var i = 0; i < length; i++) {
    rand_str += strSet.charAt(Math.floor(Math.random() * strSet.length))
  }
  return rand_str
}
