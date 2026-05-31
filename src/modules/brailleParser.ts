export interface ParsedBraille {
  docTitle: string | false;
  title: string[];
  body: string[][];
}

export function isHeader(line: string): boolean {
  if (line.split('⠒').length > 5) return false
  if (line.length < 5) return false
  return true
}

export function splitbraille(str: string): ParsedBraille {
  const pages: string[] = str.split('@PB@')
  const bodys: string[][] = []
  const titles: string[] = []
  let docTitle: boolean | string = false

  pages.forEach(page => {
    const lines: string[] = page.split('@LB@')
    let headding = false
    const p: string[] = []

    lines.forEach(line => {
      const trimLine = line.replace(/^⠀+|⠀+$/g, '')
      if (!headding) {
        if (isHeader(trimLine)) {
          titles.push(trimLine)
          if (docTitle === false) {
            docTitle = trimLine
            line = '@H1@' + line
          } else {
            line = '@H2@' + line
          }
          headding = true
        }
      }
      p.push(line)
    })

    if (!headding) {
      titles.push('⠀⠀')
    }
    bodys.push(p)
  })

  return { docTitle, title: titles, body: bodys }
}
