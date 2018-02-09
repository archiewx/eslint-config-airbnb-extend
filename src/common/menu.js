const menuData = [{
  name: '商品',
  icon: 'dashboard',
  path: 'goods-list'
},{
  name: '关系',
  icon: 'form',
  path: 'relationship',
  children: [{
    name: '客户',
    path: 'customer-list',
  },{
    name: '供应商',
    path: 'supplier-list'
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
