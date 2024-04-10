# 快速开始

## 安装

```bash
npm install @inula-ui/components @inula-ui/hooks @inula-ui/themes @inula-ui/utils
```

## 引入样式

出于打包体积以及按需引入的考虑，我们没有打包样式文件。

全局样式：

```scss
@use '@inula-ui/themes/index';
```

按需引入：

```scss
@use '@inula-ui/themes/root';

@use '@inula-ui/themes/reboot';
@use '@inula-ui/themes/animations';
@use '@inula-ui/themes/common';

@use '@inula-ui/themes/components/circular-progress';
@use '@inula-ui/themes/components/mask';
@use '@inula-ui/themes/components/wave';

@use '@inula-ui/themes/components/accordion';
```

## 演示

这里有一个简单的 Inula UI 组件的在线 codesandbox 演示：

<iframe src="https://codesandbox.io/p/devbox/getting-started-2pvn8m?embed=1&file=%2Fsrc%2FDemo.tsx"
     style="width:100%; height: 500px; overflow:hidden; border:0; border-radius: 4px;"
     title="getting-started"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>
