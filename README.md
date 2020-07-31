# TextLineHeightFix
To achieve the text line height of the design in accord with the height of the textview or UI Label in the corresponding development environment.

Text Line Height Fix 是一款调整文字行高的插件。它能够让设计图中不同字号的行高，和开发环境下对应字号所占字符框高度相匹配（Android字符框：textview、iOS字符框：UI Label）。解决设计图与开发环境在文字高度不一致的情况下，导致还原度差的问题。帮助开发人员实现更精准的设计稿还原。

使用：
-选中文字图层，点击设计图对应的设备按钮，即可完成行高的修复。
-特殊情况：如果需要将行高紧贴文字，即行高等于字号，可点击「text height」按钮实现。

注意：
-目前插件针对Android设计图，仅支持 10px-70px 的字号的行高修复，未来会拓展更多字号。iOS和 Text Height 可修复字号不限。
-仅限中文常用UI字体（苹方、思源）
-不建议多行文字使用行高修复。

感谢：
-Sketch 插件「Auto Fix iOS Text Line Height」作者 @Gis1on @Youngxkk。
项目地址：https://github.com/youngxkk/AutoFixiOSTextLineHeight
-插件中使用的波纹效果来自 https://github.com/GeekLiB/Material-Design-JS-Button

版本更新说明
v1.0.1
增加修复Component内文字行高的功能

运行命令
开发环境：npx webpack --mode=development --watch
生产环境：npx webpack --mode=production