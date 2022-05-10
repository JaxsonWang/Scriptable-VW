/**
 * 根据百分比输出 hex 颜色
 * @param {number} pct
 * @returns {Color}
 */
export const getColorForPercentage = pct => {
  const percentColors = [
    { pct: 0.0, color: { r: 0xff, g: 0x00, b: 0 } },
    { pct: 0.5, color: { r: 0xff, g: 0xff, b: 0 } },
    { pct: 1.0, color: { r: 0x00, g: 0xff, b: 0 } }
  ]

  let i = 1
  for (i; i < percentColors.length - 1; i++) {
    if (pct < percentColors[i].pct) {
      break
    }
  }
  const lower = percentColors[i - 1]
  const upper = percentColors[i]
  const range = upper.pct - lower.pct
  const rangePct = (pct - lower.pct) / range
  const pctLower = 1 - rangePct
  const pctUpper = rangePct
  const color = {
    r: Math.floor(lower.color.r * pctLower + upper.color.r * pctUpper),
    g: Math.floor(lower.color.g * pctLower + upper.color.g * pctUpper),
    b: Math.floor(lower.color.b * pctLower + upper.color.b * pctUpper)
  }
  // return 'rgb(' + [color.r, color.g, color.b].join(',') + ')'
  return new Color('#' + ((1 << 24) + (color.r << 16) + (color.g << 8) + color.b).toString(16).slice(1), 1)
}

/**
 * 一维数组转换多维数组
 * @param arr
 * @param num
 * @returns {*[]}
 */
export const format2Array = (arr, num) => {
  const  pages = []
  arr.forEach((item, index) => {
    const page = Math.floor(index / num)
    if (!pages[page]) {
      pages[page] = []
    }
    pages[page].push(item)
  })
  return pages
}
