const menuData = [{
  name: '商品',
  icon: 'form',
  path: 'goods-list'
},{
  name: '关系',
  icon: 'check-circle-o',
  path: 'relationship',
  children: [{
    name: '客户',
    path: 'customer-list',
  },{
    name: '供应商',
    path: 'supplier-list'
  }]
},{
  name:'管理中心',
  icon:'dashboard',
  path:'manage-center',
  children: [{
    name:'商品',
    path:'goods',
    children: [{
      name:'商品属性',
      path:'goods-attribute'
    },{
      name:'商品分组',
      path:'goods-group'
    },{
      name:'颜色',
      path:'color'
    },{
      name:'尺码',
      path:'size',
    },{
      name:'单位',
      path:'unit'
    },{
      name:'价格',
      path:'price'
    },{
      name:'条码',
      path:'barcode',
    },{
      name:'图片',
      path:'picture'
    }]
  }]
},{
  name: '开发',
  icon: 'smile-o',
  path: 'test'
}];

function formatter(data, parentPath = '') {
  return data.map((item) => {
    const result = {
      ...item,
      path: `${parentPath}${item.path}`,
    };
    if (item.children) {
      result.children = formatter(item.children, `${parentPath}${item.path}/`);
    }
    return result;
  });
}

export const getMenuData = () => formatter(menuData);
