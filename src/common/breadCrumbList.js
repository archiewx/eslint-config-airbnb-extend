import { getRouterData } from './router';

const routerData = JSON.parse(JSON.stringify(getRouterData()));


function breadCrumbList(pathname) {
  let breadcrumblist = [];
  if (pathname.indexOf('/manage-center/goods') > -1) {
    breadcrumblist = [{
      title: '管理中心',
    }, {
      title: '商品',
    }, {
      title: routerData[pathname].name,
    }];
  } else if (pathname.indexOf('/manage-center/customer') > -1) {
    breadcrumblist = [{
      title: '管理中心',
    }, {
      title: '客户',
    }, {
      title: routerData[pathname].name,
    }];
  } else if (pathname.indexOf('/manage-center/shop-warehouse') > -1) {
    breadcrumblist = [{
      title: '管理中心',
    }, {
      title: '库仓',
    }, {
      title: routerData[pathname].name,
    }];
  } else if (pathname.indexOf('/manage-center/bill') > -1) {
    breadcrumblist = [{
      title: '管理中心',
    }, {
      title: '单据',
    }, {
      title: routerData[pathname].name,
    }];
  }
  return breadcrumblist;
}

export default breadCrumbList;
