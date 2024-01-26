export function capitalizeSentence(str: string) {
  return str.split(' ').reduce((acc: string, word: string) => {
    const capitalizedWord = word.charAt(0).toUpperCase() + word.slice(1)

    return acc + ' ' + capitalizedWord
  }, '')
}
