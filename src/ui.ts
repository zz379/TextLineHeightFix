import './ui.css'
import './style.js'

const FIX_DEVICES_DESIGN_DESC = ['Click to fix the corresponding design', '点击按钮修复相应的设计图'];
const FIX_TEXT_LINE_HEIGHT_DESC = ['Set line height as a multiple of font size', '把行高设为字号的倍数'];
const FONT_SIZE_DESC = ['Font Size', '字    号'];
//常规浏览器语言和IE浏览器
let lang: string = navigator.language;
// console.log("当前语言: " + lang + " -- 语言列表：" + navigator.languages);
//截取lang前2位字符
// lang = lang.substr(0, 2).toLowerCase();
lang = lang.substring(0, 2).toLowerCase()
let lang_flag: number = 0;
if (lang == 'zh') {
  lang_flag = 1;
} else {
  lang_flag = 0;
}

const input = <HTMLSelectElement>document.getElementById('input_ratio')

document.getElementById('fix_devices_design')!.textContent = FIX_DEVICES_DESIGN_DESC[lang_flag];
document.getElementById('fix_text_line_height')!.textContent = FIX_TEXT_LINE_HEIGHT_DESC[lang_flag];
document.getElementById('font_size_desc')!.textContent = FONT_SIZE_DESC[lang_flag];

document.getElementById('ios_fix')!.onclick = () => {
  parent.postMessage({ pluginMessage: { type: 'fix_on_ios_uilabel' } }, '*')
}

document.getElementById('android_fix')!.onclick = () => {
  parent.postMessage({ pluginMessage: { type: 'fix_on_android_textview' } }, '*')
}

document.getElementById('text_height')!.onclick = () => {
  const ratioValue: number = Number(input.value)
  parent.postMessage({ pluginMessage: { type: 'fix_on_text_font_height', value: ratioValue } }, '*')
}

document.getElementById('icon_sub')!.onclick = () => {
  let ratioValue: number = Number(input.value)
  ratioValue = (ratioValue - 0.1) >= 0 ? ratioValue - 0.1 : 0
  input.value = ratioValue.toFixed(2)
}

document.getElementById('icon_add')!.onclick = () => {
  let ratioValue: number = Number(input.value)
  ratioValue = (ratioValue + 0.1) >= 0 ? ratioValue + 0.1 : 0
  input.value = ratioValue.toFixed(2)
}

onmessage = (event) => {
  if (event.data.pluginMessage.type === 'change_input_ratio') {
    console.log("got this from the plugin code", event.data.pluginMessage.value)
    const ratioValue: number = Number(event.data.pluginMessage.value)
    input.value = isNaN(ratioValue) ? "1.00" : ratioValue.toFixed(2)
  }
}