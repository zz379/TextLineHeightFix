// This plugin will open a modal to prompt the user to enter a number, and
// it will then create that many rectangles on the screen.

// This file holds the main code for the plugins. It has access to the *document*.
// You can access browser APIs in the <script> tag inside "ui.html" which has a
// full browser environment (see documentation).

// 构建字号和行高的对应关系Map，Android无规律可循
const transMap = {
  5: 8, 6: 9, 7: 10, 8: 12, 9: 13, 10: 14,
  11: 15, 12: 17, 13: 18, 14: 19, 15: 21, 16: 22, 17: 23, 18: 25, 19: 27, 20: 28,
  21: 29, 22: 30, 23: 32, 24: 33, 25: 34, 26: 36, 27: 37, 28: 38, 29: 39, 30: 41,
  31: 42, 32: 43, 33: 44, 34: 46, 35: 47, 36: 49, 37: 51, 38: 52, 39: 53, 40: 54,
  41: 56, 42: 57, 43: 58, 44: 59, 45: 61, 46: 62, 47: 63, 48: 65, 49: 66, 50: 67,
  51: 68, 52: 70, 53: 71, 54: 73, 55: 74, 56: 76, 57: 77, 58: 78, 59: 79, 60: 81,
  61: 82, 62: 83, 63: 85, 64: 86, 65: 87, 66: 88, 67: 90, 68: 91, 69: 92, 70: 93,
  71: 95, 72: 97, 73: 98, 74: 100, 75: 101, 76: 102, 77: 103, 78: 105, 79: 106, 80: 107,
  81: 108, 82: 110, 83: 111, 84: 112, 85: 114, 86: 115, 87: 116, 88: 117, 89: 119, 90: 121,
  91: 122, 92: 123, 93: 125, 94: 126, 95: 127, 96: 129, 97: 130, 98: 131, 99: 132, 100: 134,
  101: 135, 102: 136, 103: 137, 104: 139, 105: 140, 106: 141, 107: 143, 108: 145, 109: 146, 110: 147,
  111: 149, 112: 150, 113: 151, 114: 152, 115: 154, 116: 155, 117: 156, 118: 157, 119: 159, 120: 160
};
const FIX_TYPE_IOS = Symbol();
const FIX_TYPE_ANDROID = Symbol();
const FIX_TYPE_TEXT_FONT_HEIGHT = Symbol();
const NOTIFICATION_OPTIONS: NotificationOptions = { timeout: 1000 };

// This shows the HTML page in "ui.html".
figma.showUI(__html__, { width: 180, height: 258 });

// Get and set history ratio
figma.clientStorage.getAsync("ratio").then((res) => {
  let historyRatio: number = res
  console.log("设置历史倍率：" + historyRatio)
  figma.ui.postMessage({ type: "change_input_ratio", value: historyRatio })
})

// Calls to "parent.postMessage" from within the HTML page will trigger this
// callback. The callback will be passed the "pluginMessage" property of the
// posted message.
figma.ui.onmessage = msg => {
  // One way of distinguishing between different types of messages sent from
  // your HTML page is to use an object with a "type" property like this.
  console.log('-------------------------------------------------------------');
  console.log("message type : " + msg.type);
  let count = figma.currentPage.selection.length;
  if (count <= 0) {
    figma.notify("Please select a text layer");
    return;
  }
  // 
  if (msg.type === 'fix_on_ios_uilabel') {
    onSetLineHeight(FIX_TYPE_IOS);
  } else if (msg.type === 'fix_on_android_textview') {
    onSetLineHeight(FIX_TYPE_ANDROID);
  } else if (msg.type === 'fix_on_text_font_height') {
    let currRatio: number = msg.value;
    figma.clientStorage.setAsync("ratio", currRatio);
    console.log("保存当前倍率：" + currRatio);
    onSetLineHeight(FIX_TYPE_TEXT_FONT_HEIGHT, currRatio);
  }
  // Make sure to close the plugin when you're done. Otherwise the plugin will
  // keep running, which shows the cancel button at the bottom of the screen.
  // figma.closePlugin();
};

// 判断选中的内容是否是文本框
function instanceOfTextNode(layer: SceneNode): layer is TextNode {
  return layer.type === "TEXT";
}

// 判断选中的内容是否是Frame
function instanceOfFrameNode(layer: SceneNode): layer is FrameNode {
  return layer.type === "FRAME";
}

// 判断选中的内容是否是Group
function instanceOfGroupNode(layer: SceneNode): layer is GroupNode {
  return layer.type === "GROUP";
}

// 判断选中的内容是否是Component
function instanceOfComponentNode(layer: SceneNode): layer is ComponentNode {
  return layer.type === "COMPONENT";
}

// 判断选中的内容是否是INSTANCE
function instanceOfInstanceNode(layer: SceneNode): layer is InstanceNode {
  return layer.type === "INSTANCE";
}

// 判断是否为 Symbol 
function isSymbol(property: any): property is Symbol {
  return typeof property === 'symbol';
}

// 根据不同的fixType，计算对应的高度
function getRealLineHeight(fontSize: number, fixType: Symbol, ratio?: number): number {
  if (fixType === FIX_TYPE_IOS) {
    // 这个函数会把文本图层的每行文字的高度乘以lineHeigthMutiple 并设置成字体的真实高度
    let lineHeight: number;
    let mod = fontSize % 10;
    if (0 == mod) {
      lineHeight = fontSize + 2 * Math.floor(fontSize / 10);
    } else {
      lineHeight = fontSize + 2 * Math.floor(fontSize / 10 + 1);
    }
    return lineHeight;
  } else if (fixType === FIX_TYPE_ANDROID) {
    // 从数组中取出字号对应的行高
    if (fontSize in transMap) {
      return transMap[fontSize];
    } else {
      return undefined;
    }
  } else if (fixType === FIX_TYPE_TEXT_FONT_HEIGHT) {
    if (ratio == undefined) {
      return fontSize;
    } else {
      return fontSize * ratio;
    }
  } else {
    return undefined;
  }
}

// 设置行高
async function setLineHeight(textLayer: TextNode, fixType: Symbol, ratio?: number) {
  console.log("Prepare to change TextNode");
  console.log("文本内容：" + textLayer.characters + " " + typeof textLayer.fontName + " " + typeof textLayer.getRangeFontName(0, 1));
  if (textLayer.characters.length <= 0) {
    figma.notify("Please select a text layer");
    return;
  }
  // 加载字体
  try {
    if (isSymbol(textLayer.fontName)) {
      let len = textLayer.characters.length;
      for (let i = 0; i < len; i++) {
        let font = textLayer.getRangeFontName(i, i + 1);
        if (!isSymbol(font)) {
          console.log(`FontName = ${font.family} style = ${font.style} -- ${i}`);
          await figma.loadFontAsync(font);
        }
      }
    } else {
      await figma.loadFontAsync(textLayer.fontName);
    }
  } catch (error) {
    figma.notify("No font information detected");
    return;
  }
  // 获取字号
  let fontSize: number | PluginAPI['mixed'] = textLayer.fontSize;
  if (isSymbol(fontSize)) {
    figma.notify(`Cannot fix text layer with multiple font sizes -- Layer Content: ${textLayer.characters}`);
    return;
  }
  // 获取对应的行高
  let lineHeight: number = getRealLineHeight(fontSize, fixType, ratio);
  if (lineHeight === undefined) {
    figma.notify("Do not support for this font size");
    return;
  }
  let finalHeight: LineHeight = { value: lineHeight, unit: "PIXELS" };
  textLayer.lineHeight = finalHeight;
  console.log("Finish change TextNode");
  // 增加修复成功的提示
  if (fixType === FIX_TYPE_TEXT_FONT_HEIGHT) {
    figma.notify(`${ratio}x Fix Success`, NOTIFICATION_OPTIONS);
  } else if (fixType === FIX_TYPE_IOS) {
    figma.notify("iOS Fix Success", NOTIFICATION_OPTIONS);
  } else if (fixType === FIX_TYPE_ANDROID) {
    figma.notify("Android Fix Success", NOTIFICATION_OPTIONS);
  }
}

// 整个插件的入口
function onSetLineHeight(fixType: Symbol, ratio?: number) {
  const selection = figma.currentPage.selection;
  for (let i = 0; i < selection.length; i++) {
    const layer = selection[i];
    console.log("初始位置 X is " + layer.x + " Y is " + layer.y + " type is " + layer.type);
    if (instanceOfTextNode(layer)) {
      console.log(`Selection has '${layer.type}' and FontSize = ${String(layer.fontSize)} and LineHeight = ${!isSymbol(layer.lineHeight) && layer.lineHeight['value'] ? layer.lineHeight['value'] : "未定义"}`);
      setLineHeight(layer, fixType, ratio);
    } else if (instanceOfGroupNode(layer) || instanceOfFrameNode(layer) || instanceOfInstanceNode(layer)) {
      console.log(`There is a '${layer.type}' and children size = '${layer.children.length}'`);
      let textNodeArray: SceneNode[] = layer.findAll(function callback(node: SceneNode): boolean {
        return instanceOfTextNode(node);
      });
      console.log(`TextNode length is '${textNodeArray.length}`);
      for (const node of textNodeArray) {
        if (instanceOfTextNode(node)) {
          console.log(`Selection has '${node.type}' and FontSize = ${String(node.fontSize)} and LineHeight = ${!isSymbol(node.lineHeight) && node.lineHeight['value'] ? node.lineHeight['value'] : "未定义"}`);
          setLineHeight(node, fixType, ratio);
        }
      }
    } else if (instanceOfComponentNode(layer)) {
      figma.notify("This selection is a master component, please be careful");
      return;
    }
  }
}