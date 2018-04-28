# Duoke_Pc_Web

src 目录

## assets

资源

* log

## common

共用文件

* menu: 菜单
* router: 路由
* breadCrumbList: 管理中心的面包屑
* index: 接口 baseApi,图片 baseApi，token

## components

组件

* antd-pro: ant-design-pro 组件
* BarCodeTable: 商品新建/编辑条码组件
* Duoke: 修改 ant-degisn-pro 组件后命名为 Duoke 组件，避免修改原生 ant-design-pro 组件
* FilterDatePick: 筛选组件
* GoodsPictureModal: 商品新建/编辑图片组件
* LightBoxImage: 灯箱组件
* PriceTable: 商品新建/编辑价格组成&价格等级组件
* PriceTextTable: 商品详情组成&价格等级组件
* RelationPictureModal: 客户/供应商新建/编辑图片组件
* SelectMultiple: 商品新建/编辑商品分组组件
* StockTabel: 商品新建/编辑库存组件

## e2e

集成测试用例

## layouts

通用布局

* BasicLayout: 基础布局 | 登录之后的布局
* UserLayout: 登录布局

## models

dva model

## routes

业务页面入口

## services

后台接口服务

## utils

工具库

## 针对修改 bug 建议

1. 测试 bug 应该多测试几次，第一次出错不能说明什么，应该要多次重试，如果多次出现问题才能算 bug。出现
   一次不能说明问题。
2. 关于 web 端的问题，应该打开浏览器或者抓包查看数据问题，测试不仅仅只是看效果，一个应用是团体的的努
   力，应该是在工作允许范围内更准确的定位到某个组内的问题，而不是有问题就发给前端
3. 对于错误应该进行反馈建议，在 bug 说明中修复建议复制下来
4. 测试设备如果移动端应该使用多机型，电脑使用多个浏览器，但就使用 safari 来说，不是所有人都是
   safari。
5. 测试应该明确一点就是当前程序是修改过的，也就是说在修改过程中，如果发现大量重复问题，不是继续测试
   ，应该找开发，探测当前代码是否是最新，同时在应用中加入版本控制的操作
