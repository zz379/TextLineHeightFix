import './ui.css'
import './style.js'

const FIX_DEVICES_DESIGN_DESC = ['Click to fix the corresponding design', '点击按钮修复相应的设计图'];
const FIX_TEXT_LINE_HEIGHT_DESC = ['Set the line height be accordant with the text height', '将行高与文本高度设为一致'];
//常规浏览器语言和IE浏览器
let lang: string = navigator.language;
// console.log("当前语言: " + lang + " -- 语言列表：" + navigator.languages);
//截取lang前2位字符
lang = lang.substr(0, 2).toLowerCase();
let lang_flag: number = 0;
if (lang == 'zh') {
  lang_flag = 1;
} else {
  lang_flag = 0;
}
document.getElementById('fix_devices_design').textContent = FIX_DEVICES_DESIGN_DESC[lang_flag];
document.getElementById('fix_text_line_height').textContent = FIX_TEXT_LINE_HEIGHT_DESC[lang_flag];

document.getElementById('ios_fix').onclick = () => {
  parent.postMessage({ pluginMessage: { type: 'fix_on_ios_uilabel' } }, '*')
}

document.getElementById('android_fix').onclick = () => {
  parent.postMessage({ pluginMessage: { type: 'fix_on_android_textview' } }, '*')
}

document.getElementById('text_height').onclick = () => {
  parent.postMessage({ pluginMessage: { type: 'fix_on_text_font_height' } }, '*')
}