import React from 'react';
import dynamic from 'dva/dynamic';
import { getMenuData } from './menu';

// wrapper of dynamic
const dynamicWrapper = (app, models, component) => dynamic({
  app,
  // eslint-disable-next-line no-underscore-dangle
  models: () => models.filter(m => !app._models.some(({ namespace }) => namespace === m)).map(m => import(`../models/${m}.js`)),
  // add routerData prop
  component: () => {
    const routerData = getRouterData(app);
    return component().then((raw) => {
      const Component = raw.default || raw;
      return props => <Component {...props} routerData={routerData} />;
    });
  },
});

function getFlatMenuData(menus) {
  let keys = {};
  menus.forEach((item) => {
    if (item.children) {
      keys[item.path] = item.name;
      keys = { ...keys, ...getFlatMenuData(item.children) };
    } else {
      keys[item.path] = item.name;
    }
  });
  return keys;
}

export const getRouterData = (app) => {
  const routerData = {
    '/': {
      component: dynamicWrapper(app, ['user', 'login'], () => import('../layouts/BasicLayout')),
    },
    '/goods-list': {
      component: dynamicWrapper(app, ['goodsList','layoutFilter'], () => import('../routes/Goods/GoodsList/GoodsList')),
    },
    '/goods-create': {
      component: dynamicWrapper(app, ['goodsCreateOrEdit'], () => import('../routes/Goods/GoodsCreateOrEdit/GoodsCreateOrEdit')),
    },
    '/goods-edit/:id': {
      component: dynamicWrapper(app, ['goodsCreateOrEdit'], () => import('../routes/Goods/GoodsCreateOrEdit/GoodsCreateOrEdit')),
    },
    '/goods-detail/:id': {
      component: dynamicWrapper(app, ['goodsDetail','layoutFilter'], () => import('../routes/Goods/GoodsDetail/GoodsDetail')),
    },
    '/relationship/customer-list': {
      component: dynamicWrapper(app, ['customerList','layoutFilter'], () => import('../routes/Relationship/Customer/CustomerList/CustomerList'))
    },
    '/relationship/customer-create': {
      component: dynamicWrapper(app, ['customerCreateOrEdit','seller','priceGrade','goodsGroup','country'], () => import('../routes/Relationship/Customer/CustomerCreateOrEdit/CustomerCreateOrEdit'))
    },
    '/relationship/customer-detail/:id':{
      component: dynamicWrapper(app, ['customerDetail'], () => import('../routes/Relationship/Customer/CustomerDetail/CustomerDetail'))
    },
    '/relationship/customer-detail/goods-purchase-detail/:id/:subId': {
      component: dynamicWrapper(app ,['goodsPurchaseDetail'], () => import('../routes/Relationship/Customer/CustomerDetail/GoodsPurchaseDetail'))
    },
    '/relationship/supplier-list': {
      component: dynamicWrapper(app, ['supplierList'], () => import('../routes/Relationship/Supplier/SupplierList/SupplierList'))
    },
    '/404': {
      component: dynamicWrapper(app, [], () => import('../routes/Exception/404')),
    },
    '/test': {
      component: dynamicWrapper(app, ['test'], () => import('../routes/Test/Test'))
    }
    // '/user': {
    //   component: dynamicWrapper(app, [], () => import('../layouts/UserLayout')),
    // },
  };
  // Get name from ./menu.js or just set it in the router data.
  const menuData = getFlatMenuData(getMenuData());
  const routerDataWithName = {};
  Object.keys(routerData).forEach((item) => {
    routerDataWithName[item] = {
      ...routerData[item],
      name: routerData[item].name || menuData[item.replace(/^\//, '')],
    };
  });
  return routerDataWithName;
};
