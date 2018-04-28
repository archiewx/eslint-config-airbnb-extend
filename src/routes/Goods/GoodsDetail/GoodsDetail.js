import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { routerRedux, Link } from 'dva/router';
import moment from 'moment';
import currency from 'currency.js';
import pathToRegexp from 'path-to-regexp';
import {
  Row,
  Col,
  Card,
  Button,
  message,
  Table,
  Icon,
  Menu,
  Dropdown,
  Popconfirm,
  Divider,
  Form,
  DatePicker,
} from 'antd';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import DescriptionList from '../../../components/antd-pro/DescriptionList';
import LightBoxImage from '../../../components/LightBoxImage/LightBoxImage';
import PriceTextTable from '../../../components/PriceTextTable/PriceTextTable';
// import FilterDatePick from '../../../components/FilterDatePick';
import FilterPicker from '../../../components/FilterPicker/FilterPicker';
import styles from './GoodsDetail.less';

const ButtonGroup = Button.Group;
const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const { Description } = DescriptionList;
const agoSevenDays = new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000);
const NCNF = (value) => currency(value, { symbol: '', precision: 2 });
const NCNI = (value) => currency(value, { symbol: '', precision: 0 });
const tabList = [
  {
    key: 'message',
    tab: '信息',
  },
  {
    key: 'sale',
    tab: '销售',
  },
  {
    key: 'purchase',
    tab: '进货',
  },
  {
    key: 'customer',
    tab: '客户',
  },
  {
    key: 'supplier',
    tab: '供应商',
  },
  {
    key: 'stock',
    tab: '库存',
  },
];
const customerPagination = {
  showQuickJumper: true,
  showSizeChanger: true,
};
const supplierPagination = {
  showQuickJumper: true,
  showSizeChanger: true,
};
const datePick = {
  date_type: 'custom',
  sday: moment(new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000), 'YYYY-MM-DD').format(
    'YYYY-MM-DD',
  ),
  eday: moment(new Date(), 'YYYY-MM-DD').format('YYYY-MM-DD'),
};
@Form.create()
@connect((state) => ({
  goodsDetail: state.goodsDetail,
  layoutFilter: state.layoutFilter,
  configSetting: state.configSetting,
}))
export default class GoodsDetail extends PureComponent {
  state = {
    activeTabKey: 'message',
    selectCustomerMode: {
      name: '不分组',
      mode: 'customer',
    },
    sortSale: {
      sorts: {},
    },
    filterSale: datePick,
    sortPurchase: {
      sorts: {},
    },
    filterPurchase: datePick,
    sortCustomer: {
      sorts: {},
    },
    filterCustomer: datePick,
    pageCustomer: {
      page: 1,
      per_page: 10,
    },
    sortSupplier: {
      sorts: {},
    },
    filterSupplier: datePick,
    sortStock: {
      sorts: {},
    },
    filterStock: datePick,
  };

  componentDidMount() {
    const match = pathToRegexp('/goods-detail/:id').exec(this.props.history.location.pathname);
    this.props.dispatch({
      type: 'goodsDetail/setState',
      payload: {
        singleGoodsDetail: {},
      },
    });
    if (match) {
      this.props.dispatch({ type: 'goodsDetail/getSingle', payload: { id: match[1] } });
      this.props.dispatch({ type: 'layoutFilter/getLayoutFilter' });
    }
  }

  // 切换tabe
  handleTabChange = (key) => {
    this.setState({ activeTabKey: key });
  };

  // 改变商品状态
  handleSelectGoodStatus = (not_sale, { id }) => {
    this.props.dispatch({
      type: 'goodsDetail/changeGoodsStatus',
      payload: {
        id,
        not_sale: not_sale == 1 ? 0 : 1,
      },
    });
  };

  // 删除商品
  handleDeleteSingleGoods = (id, { item, key, keyPath }) => {
    this.props.dispatch({ type: 'goodsDetail/deleteSingleGoods', payload: id }).then(() => {
      this.prop.dispatch(routerRedux.push('/goods-list'));
    });
  };

  handleToGoodsEdit = (id) => {
    this.props.dispatch(routerRedux.push(`/goods-edit/${id}`));
  };

  // 排序
  handleSaleSort = (pagination, filters, sorter) => {
    const sortSale = {
      sorts: {},
    };
    if (sorter.field) {
      sortSale.sorts[sorter.field] = sorter.order.slice(0, sorter.order.length - 3);
    } else {
      sortSale.sorts = {};
    }
    this.setState({ sortSale });
    this.props.dispatch({
      type: 'goodsDetail/getSingleSales',
      payload: {
        ...this.state.filterSale,
        ...sortSale,
        id: this.props.goodsDetail.currentId.id,
      },
    });
  };

  // 筛选
  handleSaleFilter = (search) => {
    this.props.dispatch({
      type: 'goodsDetail/setFilterSaleServerData',
      payload: search,
    });
    const filterSale = this.props.goodsDetail.filterSaleServerData;
    this.setState({ filterSale });
    this.props.dispatch({
      type: 'goodsDetail/getSingleSales',
      payload: {
        ...filterSale,
        ...this.state.sortSale,
        id: this.props.goodsDetail.currentId.id,
      },
    });
  };

  // 排序
  handlePurchaseSort = (pagination, filters, sorter) => {
    const sortPurchase = {
      sorts: {},
    };
    if (sorter.field) {
      sortPurchase.sorts[sorter.field] = sorter.order.slice(0, sorter.order.length - 3);
    } else {
      sortPurchase.sorts = {};
    }
    this.setState({ sortPurchase });
    this.props.dispatch({
      type: 'goodsDetail/getSinglePurchases',
      payload: {
        ...this.state.filterPurchase,
        ...sortPurchase,
        id: this.props.goodsDetail.currentId.id,
      },
    });
  };

  // 筛选
  handlePurchaseFilter = (search) => {
    this.props.dispatch({
      type: 'goodsDetail/setFilterPurchaseServerData',
      payload: search,
    });
    const filterPurchase = this.props.goodsDetail.filterPurchaseServerData;
    this.setState({ filterPurchase });
    this.props.dispatch({
      type: 'goodsDetail/getSinglePurchases',
      payload: {
        ...filterPurchase,
        ...this.state.sortPurchase,
        id: this.props.goodsDetail.currentId.id,
      },
    });
  };

  // 排序
  handleCustomerSort = (pagination, filters, sorter) => {
    const pageCustomer = {
      page: pagination.current,
      per_page: pagination.pageSize,
    };
    this.setState({ pageCustomer });
    const sortCustomer = {
      sorts: {},
    };
    if (sorter.field) {
      sortCustomer.sorts[sorter.field] = sorter.order.slice(0, sorter.order.length - 3);
    } else {
      sortCustomer.sorts = {};
    }
    this.setState({ sortCustomer });
    this.props.dispatch({
      type: 'goodsDetail/getSingleCustomers',
      payload: {
        ...this.state.filterCustomer,
        ...sortCustomer,
        id: this.props.goodsDetail.currentId.id,
        mode: this.state.selectCustomerMode.mode,
      },
    });
  };

  // 筛选
  handleCustomerFilter = (search) => {
    this.props.dispatch({
      type: 'goodsDetail/setFilterCustomerServerData',
      payload: search,
    });
    const filterCustomer = this.props.goodsDetail.filterCustomerServerData;
    this.setState({ filterCustomer });
    this.props.dispatch({
      type: 'goodsDetail/getSingleCustomers',
      payload: {
        ...filterCustomer,
        ...this.state.sortCustomer,
        id: this.props.goodsDetail.currentId.id,
        mode: this.state.selectCustomerMode.mode,
      },
    });
  };

  // 客户模式
  handleCustomerModeSelect = ({ item, key, keyPath }) => {
    const selectCustomerMode = {
      name: item.props.children,
      mode: key,
    };
    this.setState({ selectCustomerMode });
    this.props.dispatch({
      type: 'goodsDetail/getSingleCustomers',
      payload: {
        ...this.state.filterCustomer,
        ...this.state.sortCustomer,
        id: this.props.goodsDetail.currentId.id,
        mode: key,
      },
    });
  };

  // 排序
  handleSupplierSort = (pagination, filters, sorter) => {
    const sortSupplier = {
      sorts: {},
    };
    if (sorter.field) {
      sortSupplier.sorts[sorter.field] = sorter.order.slice(0, sorter.order.length - 3);
    } else {
      sortSupplier.sorts = [];
    }
    this.setState({ sortSupplier });
    this.props.dispatch({
      type: 'goodsDetail/getSingleSuppliers',
      payload: {
        ...this.state.filterSupplier,
        ...sortSupplier,
        id: this.props.goodsDetail.currentId.id,
      },
    });
  };

  // 筛选
  handleSupplierFilter = (search) => {
    this.props.dispatch({
      type: 'goodsDetail/setFilterSupplierServerData',
      payload: search,
    });
    const filterSupplier = this.props.goodsDetail.filterSupplierServerData;
    this.setState({ filterSupplier });
    this.props.dispatch({
      type: 'goodsDetail/getSingleSuppliers',
      payload: {
        ...filterSupplier,
        ...this.state.sortSupplier,
        id: this.props.goodsDetail.currentId.id,
      },
    });
  };

  // 排序
  handleStockSort = (pagination, filters, sorter) => {
    const sortStock = {
      sorts: {},
    };
    if (sorter.field) {
      sortStock.sorts[sorter.field] = sorter.order.slice(0, sorter.order.length - 3);
    } else {
      sortStock.sorts = {};
    }
    this.setState({ sortStock });
    this.props.dispatch({
      type: 'goodsDetail/getSingleStocks',
      payload: {
        ...this.state.filterStock,
        ...sortStock,
        id: this.props.goodsDetail.currentId.id,
      },
    });
  };

  // 筛选
  handleStockFilter = (search) => {
    this.props.dispatch({
      type: 'goodsDetail/setFilterStockServerData',
      payload: search,
    });
    const filterStock = this.props.goodsDetail.filterStockServerData;
    this.setState({ filterStock });
    this.props.dispatch({
      type: 'goodsDetail/getSingleStocks',
      payload: {
        ...filterStock,
        ...this.state.sortStock,
        id: this.props.goodsDetail.currentId.id,
      },
    });
  };

  render() {
    const { activeTabKey, selectCustomerMode, pageCustomer } = this.state;
    const {
      singleGoodsDetail,
      singleGoodsSales,
      singleGoodsPurchases,
      singleGoodsCustomers,
      singleGoodsSuppliers,
      singleGoodsStocks,
      currentId,
      singleCustomerMode,
    } = this.props.goodsDetail;
    const { goodsDetailFilter } = this.props.layoutFilter;
    const { usePricelelvel, priceModel } = this.props.configSetting;

    const description = (
      <DescriptionList col="2" size="small" className={styles.descriptionPostion}>
        <Description term="进货价">{`${singleGoodsDetail.purchase_price || ''}`}</Description>
        <Description term="标准价">{`${singleGoodsDetail.standard_price || ''}`}</Description>
        <Description term="名称">{`${singleGoodsDetail.name || ''}`}</Description>
        <Description term="备注">{`${singleGoodsDetail.desc || ''}`}</Description>
      </DescriptionList>
    );

    const breadcrumbList = [
      {
        title: '商品',
        href: '/goods-list/goods-sale',
      },
      {
        title: singleGoodsDetail.item_ref || '',
      },
    ];

    const menu = (
      <Menu style={{ width: 109 }}>
        <Menu.Item key="1">
          <Popconfirm
            title="确认删除此商品?"
            placement="bottom"
            onConfirm={this.handleDeleteSingleGoods.bind(null, currentId)}>
            <span style={{ width: '100%', display: 'inline-block' }}>删除</span>
          </Popconfirm>
        </Menu.Item>
      </Menu>
    );

    const action = (
      <div>
        <ButtonGroup>
          <Popconfirm
            title={singleGoodsDetail.not_sale === '1' ? '确认解除停售此商品?' : '确认停售此商品?'}
            onConfirm={this.handleSelectGoodStatus.bind(
              null,
              singleGoodsDetail.not_sale,
              currentId,
            )}>
            <Button>{singleGoodsDetail.not_sale === '1' ? '在售' : '停售'}</Button>
          </Popconfirm>
          <Dropdown overlay={menu} placement="bottomRight">
            <Button>
              <Icon type="ellipsis" />
            </Button>
          </Dropdown>
        </ButtonGroup>
        <Button type="primary" onClick={this.handleToGoodsEdit.bind(null, currentId.id)}>
          编辑
        </Button>
      </div>
    );

    const customerMenu = (
      <Menu onClick={this.handleCustomerModeSelect}>
        {singleCustomerMode.map((item) => {
          return <Menu.Item key={`${item.mode}`}>{item.name}</Menu.Item>;
        })}
      </Menu>
    );

    const customerExrta = (
      <Dropdown overlay={customerMenu}>
        <Button style={{ marginLeft: 8 }}>
          更改模式 <Icon type="down" />
        </Button>
      </Dropdown>
    );

    const saleExpandedRowRender = (item) => {
      return (
        <Table
          showHeader={false}
          columns={saleColumns}
          dataSource={item.childrens}
          pagination={false}
          rowKey="id"
        />
      );
    };

    const purchaseExpandedRowRender = (item) => {
      return (
        <Table
          showHeader={false}
          columns={purchaseColumns}
          dataSource={item.childrens}
          pagination={false}
          rowKey="id"
        />
      );
    };

    const stockExpandedRowRender = (item) => {
      return (
        <Table
          showHeader={false}
          columns={stockColumns}
          dataSource={item.childrens}
          pagination={false}
          rowKey="id"
        />
      );
    };

    const status =
      singleGoodsDetail.not_sale == 0 ? (
        <div>
          <span className={styles.onSaleStatus}>• </span>
          <span style={{ color: 'rgba(0, 0, 0, 0.85)' }}>在售</span>
        </div>
      ) : (
        <div>
          <span className={styles.stopSaleStatus}>• </span>
          <span style={{ color: 'rgba(0, 0, 0, 0.85)' }}>停售</span>
        </div>
      );

    const saleColumns = [
      {
        title: '名称',
        dataIndex: 'name',
        width: '15%',
      },
      {
        title: '销售量',
        width: '15%',
        dataIndex: 'sales_quantity',
        sorter: true,
        className: styles.numberRightMove,
        render: (text, record) => NCNI(record.sales_quantity).format(true),
      },
      {
        title: '销售额',
        dataIndex: 'sales_amount',
        sorter: true,
        width: '25%',
        className: styles.numberRightMove,
        render: (text, record) => NCNF(record.sales_amount).format(true),
      },
      {
        title: '利润',
        dataIndex: 'profit',
        sorter: true,
        width: '25%',
        className: styles.numberRightMove,
        render: (text, record) => NCNF(record.profit).format(true),
      },
      {
        title: '库存',
        dataIndex: 'stock_quantity',
        sorter: true,
        width: '20%',
        className: styles.numberRightMove,
        render: (text, record) => NCNF(record.stock_quantity).format(true),
      },
    ];

    const purchaseColumns = [
      {
        title: '名称',
        dataIndex: 'name',
        width: '15%',
      },
      {
        title: '进货量',
        dataIndex: 'purchase_quantity',
        sorter: true,
        width: '25%',
        className: styles.numberRightMove,
        render: (text, record) => NCNI(record.purchase_quantity).format(true),
      },
      {
        title: '进货额',
        dataIndex: 'purchase_amount',
        sorter: true,
        width: '30%',
        className: styles.numberRightMove,
        render: (text, record) => NCNF(record.purchase_amount).format(true),
      },
      {
        title: '库存',
        dataIndex: 'stock_quantity',
        sorter: true,
        width: '30%',
        className: styles.numberRightMove,
        render: (text, record) => NCNF(record.stock_quantity).format(true),
      },
    ];

    const stockColumns = [
      {
        title: '名称',
        dataIndex: 'name',
        width: '15%',
      },
      {
        title: '出货量',
        dataIndex: 'sales_quantity',
        width: '25%',
        sorter: true,
        className: styles.numberRightMove,
        render: (text, record) => NCNI(record.sales_quantity).format(true),
      },
      {
        title: '入货量',
        dataIndex: 'purchase_quantity',
        width: '30%',
        sorter: true,
        className: styles.numberRightMove,
        render: (text, record) => NCNI(record.purchase_quantity).format(true),
      },
      {
        title: '库存量',
        dataIndex: 'stock_quantity',
        width: '30%',
        sorter: true,
        className: styles.numberRightMove,
        render: (text, record) => NCNF(record.stock_quantity).format(true),
      },
    ];

    const customerColumns = [
      {
        title: '名称',
        dataIndex: 'name',
        width: '15%',
      },
      {
        title: '购买量',
        dataIndex: 'sales_quantity',
        width: '15%',
        sorter: true,
        className: styles.numberRightMove,
        render: (text, record) => NCNI(record.sales_quantity).format(true),
      },
      {
        title: '购买额',
        dataIndex: 'sales_amount',
        width: '25%',
        sorter: true,
        className: styles.numberRightMove,
        render: (text, record) => NCNF(record.sales_amount).format(true),
      },
      {
        title: '退货量',
        dataIndex: 'sales_return_quantity',
        width: '25%',
        sorter: true,
        className: styles.numberRightMove,
        render: (text, record) => NCNI(record.sales_return_quantity).format(true),
      },
      {
        title: '利润',
        dataIndex: 'profit',
        width: '20%',
        sorter: true,
        className: styles.numberRightMove,
        render: (text, record) => NCNF(record.profit).format(true),
      },
    ];

    const supplierColumns = [
      {
        title: '名称',
        dataIndex: 'name',
        width: '15%',
      },
      {
        title: '供应量',
        dataIndex: 'purchase_quantity',
        sorter: true,
        width: '40%',
        className: styles.numberRightMove,
        render: (text, record) => NCNI(record.purchase_quantity).format(true),
      },
      {
        title: '供应额',
        dataIndex: 'purchase_amount',
        width: '45%',
        sorter: true,
        className: styles.numberRightMove,
        render: (text, record) => NCNF(record.purchase_amount).format(true),
      },
    ];
    return (
      <PageHeaderLayout
        title={`货号：${singleGoodsDetail.item_ref || ''}`}
        logo={
          <img alt="" src="https://gw.alipayobjects.com/zos/rmsportal/nxkuOJlFJuAUhzlMTCEe.png" />
        }
        breadcrumbList={breadcrumbList}
        activeTabKey={activeTabKey}
        tabList={tabList}
        content={description}
        action={action}
        status={status}
        onTabChange={this.handleTabChange}>
        <div style={{ display: activeTabKey == 'message' ? 'block' : 'none' }}>
          <Card bordered={false}>
            {!singleGoodsDetail.hidePriceTable ? (
              <DescriptionList
                title={usePricelelvel === 'yes' ? '价格等级&价格组成' : '价格组成（零售价)'}
                size="large"
                style={{ paddingBottom: 32 }}>
                <PriceTextTable
                  tableValue={singleGoodsDetail.prices}
                  usePricelelvel={usePricelelvel}
                  priceModel={priceModel}
                  priceGrades={singleGoodsDetail.priceGrades}
                  shops={singleGoodsDetail.selectShops}
                  units={singleGoodsDetail.selectUnits}
                  quantityranges={singleGoodsDetail.selectQuantityStep}
                />
              </DescriptionList>
            ) : null}
            <DescriptionList title="属性" col="2" size="large">
              <Description
                term="单位"
                style={{ display: singleGoodsDetail.units ? 'block' : 'none' }}>
                {singleGoodsDetail.units || ''}
              </Description>
              <Description
                term="颜色"
                style={{ display: singleGoodsDetail.colors ? 'block' : 'none' }}>
                {singleGoodsDetail.colors || ''}
              </Description>
              <Description
                term="尺码"
                style={{ display: singleGoodsDetail.sizes ? 'block' : 'none' }}>
                {singleGoodsDetail.sizes || ''}
              </Description>
              <Description
                term="商品分组"
                style={{ display: singleGoodsDetail.goodsGroup ? 'block' : 'none' }}>
                {singleGoodsDetail.goodsGroup || ''}
              </Description>
            </DescriptionList>
            {(singleGoodsDetail.images || []).length === 0 ? null : (
              <div>
                <DescriptionList
                  title="图片"
                  style={{ paddingBottom: 32, paddingTop: 16, marginLeft: 0 }}
                  size="large">
                  <LightBoxImage
                    imageSource={singleGoodsDetail.images || []}
                    style={{ marginLeft: 0 }}
                  />
                </DescriptionList>
              </div>
            )}
          </Card>
        </div>
        <div style={{ display: activeTabKey == 'sale' ? 'block' : 'none' }}>
          {/* <Card bordered={false} className={styles.bottomCardDivided}>
            <FilterDatePick
              onChange={this.handleSaleFilter}
              filterOptions={goodsDetailFilter}
              tagLabel="sale"
              dateLabel="sale"
            />
          </Card> */}
          <FilterPicker onChange={this.handleSaleFilter} filters={goodsDetailFilter} />
          <Card bordered={false}>
            <Table
              columns={saleColumns}
              dataSource={singleGoodsSales}
              onChange={this.handleSaleSort}
              pagination={false}
              rowKey="id"
            />
          </Card>
        </div>
        <div style={{ display: activeTabKey == 'purchase' ? 'block' : 'none' }}>
          {/* <Card bordered={false} className={styles.bottomCardDivided}>
            <FilterDatePick
              onChange={this.handlePurchaseFilter}
              filterOptions={goodsDetailFilter}
              tagLabel="purchase"
              dateLabel="purchase"
            />
          </Card> */}
          <FilterPicker onChange={this.handlePurchaseFilter} filters={goodsDetailFilter} />
          <Card bordered={false}>
            <Table
              columns={purchaseColumns}
              dataSource={singleGoodsPurchases}
              onChange={this.handlePurchaseSort}
              pagination={false}
              rowKey="id"
            />
          </Card>
        </div>
        <div style={{ display: activeTabKey == 'customer' ? 'block' : 'none' }}>
          {/* <Card bordered={false} className={styles.bottomCardDivided}>
            <FilterDatePick
              onChange={this.handleCustomerFilter}
              filterOptions={goodsDetailFilter}
              tagLabel="customer"
              dateLabel="customer"
            />
          </Card> */}
          <FilterPicker onChange={this.handleCustomerFilter} filters={goodsDetailFilter} />
          <Card bordered={false} title={selectCustomerMode.name} extra={customerExrta}>
            <Table
              columns={customerColumns}
              dataSource={singleGoodsCustomers}
              onChange={this.handleCustomerSort}
              rowKey="id"
              pagination={selectCustomerMode.mode == 'customer' ? customerPagination : false}
            />
            {selectCustomerMode.mode == 'customer' ? (
              <div style={{ marginTop: -43, width: 300 }}>
                <span>{`共 ${singleGoodsCustomers.length || ''} 位客户 第 ${
                  pageCustomer.page
                } / ${Math.ceil(
                  Number(singleGoodsCustomers.length) / Number(pageCustomer.per_page),
                )} 页`}</span>
              </div>
            ) : null}
          </Card>
        </div>
        <div style={{ display: activeTabKey == 'supplier' ? 'block' : 'none' }}>
          {/* <Card bordered={false} className={styles.bottomCardDivided}>
            <FilterDatePick
              onChange={this.handleSupplierFilter}
              filterOptions={goodsDetailFilter}
              tagLabel="supplier"
              dateLabel="supplier"
            />
          </Card> */}
          <FilterPicker onChange={this.handleSupplierFilter} filters={goodsDetailFilter} />
          <Card bordered={false}>
            <Table
              columns={supplierColumns}
              dataSource={singleGoodsSuppliers}
              onChange={this.handleSupplierSort}
              pagination={false}
              rowKey="id"
            />
          </Card>
        </div>
        <div style={{ display: activeTabKey == 'stock' ? 'block' : 'none' }}>
          <FilterPicker onChange={this.handleStockFilter} filters={goodsDetailFilter} />
          <Card bordered={false}>
            <Table
              columns={stockColumns}
              dataSource={singleGoodsStocks}
              onChange={this.handleStockSort}
              pagination={false}
              rowKey="id"
            />
          </Card>
        </div>
      </PageHeaderLayout>
    );
  }
}
