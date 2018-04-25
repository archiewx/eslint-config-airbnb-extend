# Duoke_Pc_Web

src目录

## assets
资源

- log

## common
共用文件

- menu: 菜单
- router: 路由
- breadCrumbList: 管理中心的面包屑
- index: 接口baseApi,图片baseApi，token

## components
组件

- antd-pro: ant-design-pro组件
- BarCodeTable: 商品新建/编辑条码组件
- Duoke: 修改ant-degisn-pro组件后命名为Duoke组件，避免修改原生ant-design-pro组件
- FilterDatePick: 筛选组件
- GoodsPictureModal: 商品新建/编辑图片组件
- LightBoxImage: 灯箱组件
- PriceTable: 商品新建/编辑价格组成&价格等级组件
- PriceTextTable: 商品详情组成&价格等级组件
- RelationPictureModal: 客户/供应商新建/编辑图片组件
- SelectMultiple: 商品新建/编辑商品分组组件
- StockTabel: 商品新建/编辑库存组件

## e2e
集成测试用例

## layouts
通用布局

- BasicLayout: 基础布局 | 登录之后的布局
- UserLayout: 登录布局

## models
dva model

## routes
业务页面入口

## services
后台接口服务

## utils
工具库

## 针对修改bug建议

1. 测试bug应该多测试几次，第一次出错不能说明什么，应该要多次重试，如果多次出现问题才能算bug。出现一次不能说明问题。
2. 关于web端的问题，应该打开浏览器或者抓包查看数据问题，测试不应该只测试界面问题的
3. 对于错误应该进行反馈建议，在bug 说明中修复建议复制下来
4. 测试设备如果移动端应该使用多机型，电脑使用多个浏览器，但就使用safari来说，不是所有人都是safari。

