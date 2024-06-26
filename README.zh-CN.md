<p align="center">
  <a href="//inula-ui.github.io/" rel="noopener" target="_blank"><img width="150" src="https://raw.githubusercontent.com/inula-ui/inula-ui/main/apps/site/public/logo.png" alt="logo"></a>
</p>

<h1 align="center">Inula UI</h1>

<div align="center">

<!-- prettier-ignore-start -->
[![npm latest package](http://img.shields.io/npm/v/@inula-ui/components/latest.svg?style=flat-square)](https://www.npmjs.com/package/@inula-ui/components)
[![npm bundle size](https://img.shields.io/bundlephobia/minzip/@inula-ui/components?style=flat-square)](https://bundlephobia.com/package/@inula-ui/components)
[![gitHub workflow status](https://img.shields.io/github/actions/workflow/status/inula-ui/inula-ui/main.yml?branch=main&style=flat-square)](https://github.com/inula-ui/inula-ui/actions/workflows/main.yml)
<!-- prettier-ignore-end -->

</div>

<div align="center">

[English](README.md) | 简体中文

</div>

## 安装

```bash
npm install @inula-ui/components @inula-ui/hooks @inula-ui/themes @inula-ui/utils
```

## 快速开始

```tsx
import type { LContextIn } from '@inula-ui/components/context';

import { ConfigProvider, Root } from '@inula-ui/components';
import { useMemo } from 'openinula';

export default function App() {
  const lContext = useMemo<LContextIn>(
    () => ({
      layoutPageScrollEl: '#app-main',
      layoutContentResizeEl: '#app-content',
    }),
    [],
  );

  return (
    <ConfigProvider context={lContext}>
      <Root>
        <main id="app-main" style={{ overflow: 'auto' }}>
          <section id="app-content" style={{ height: '200vh' }}>
            Some content...
          </section>
        </main>
      </Root>
    </ConfigProvider>
  );
}
```

## 链接

- [首页](https://inula-ui.github.io)
- [CodeSandbox 模板](https://codesandbox.io/s/getting-started-22yzz3)
- [openInula](https://openinula.net)

## 贡献

请先阅读我们的[贡献指南](/CONTRIBUTING.md)。

## 授权协议

[![gitHub license](https://img.shields.io/github/license/inula-ui/inula-ui?style=flat-square)](/LICENSE)
