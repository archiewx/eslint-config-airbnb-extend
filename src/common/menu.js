const menuData = [{
  name:'商品',
  icon:'smile-o',
  path:'goods-list'
},{
  name: '404',
  icon: 'warning',
  path: '404',
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
