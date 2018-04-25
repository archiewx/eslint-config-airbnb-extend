import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { routerRedux, Link } from 'dva/router';
import moment from 'moment';
import currency from 'currency.js';
import { Card, Button, Table, Icon, Select, Menu, Dropdown, Popconfirm, Divider } from 'antd';
import querystring from 'querystring';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import styles from './GoodsList.less';
import FilterPicker from '../../../components/FilterPicker/FilterPicker';

const NCNF = (value) => currency(value, { symbol: '', precision: 2 });
const NCNI = (value) => currency(value, { symbol: '', precision: 0 });
const sortSaleOptions = [
  {
    name: '创建时间降序',
    id: 1,
    sorts: {
      created_at: 'desc',
    },
  },
  {
    name: '创建时间升序',
    id: 2,
    sorts: {
      created_at: 'asc',
    },
  },
  {
    name: '更新时间降序',
    id: 3,
    sorts: {
      updated_at: 'desc',
    },
  },
  {
    name: '更新时间升序',
    id: 4,
    sorts: {
      updated_at: 'asc',
    },
  },
  {
    name: '销售量降序',
    id: 5,
    sorts: {
      sales_quantity: 'desc',
    },
  },
  {
    name: '销售量升序',
    id: 6,
    sorts: {
      sales_quantity: 'asc',
    },
  },
  {
    name: '销售额降序',
    id: 7,
    sorts: {
      sales_amount: 'desc',
    },
  },
  {
    name: '销售额升序',
    id: 8,
    sorts: {
      sales_amount: 'asc',
    },
  },
  {
    name: '库存量降序',
    id: 9,
    sorts: {
      stock_quantity: 'desc',
    },
  },
  {
    name: '库存量升序',
    id: 10,
    sorts: {
      stock_quantity: 'asc',
    },
  },
];
const datePick = {
  date_type: 'custom',
  sday: moment(new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000), 'YYYY-MM-DD').format(
    'YYYY-MM-DD',
  ),
  eday: moment(new Date(), 'YYYY-MM-DD').format('YYYY-MM-DD'),
};
const condition = {
  sorts: {
    created_at: 'desc',
  },
  page: 1,
  per_page: 10,
  ...datePick,
};
@connect((state) => ({
  goodsList: state.goodsList,
  layoutFilter: state.layoutFilter,
}))
export default class GoodsListSale extends PureComponent {
  state = {
    activeTabKey: 'sale',
    sortSale: {
      created_at: 'desc',
    },
    pagesSale: {
      per_page: 10,
      page: 1,
    },
    filterSale: datePick,
  };

  componentDidMount() {
    this.props.dispatch({ type: 'goodsList/getGoodsList', payload: condition });
    this.props.dispatch({ type: 'layoutFilter/getLayoutFilter', payload: condition });
  }

  // 跳转新建商品
  handleToGoodsCreate = () => {
    this.props.dispatch(
      routerRedux.push(`/goods-create?${querystring.stringify({ type: 'sale' })}`),
    );
  };

  // 更改商品状态
  handleSelectGoodStatus = (item) => {
    this.props
      .dispatch({
        type: 'goodsList/changeGoodsStatus',
        payload: {
          id: item.id,
          not_sale: item.not_sale == '1' ? 0 : 1,
        },
      })
      .then(() => {
        this.handleGetSaleList(this.state.filterSale, this.state.pagesSale, this.state.sortSale);
      });
  };

  // 删除商品
  handleDeleteSingleGoods = (item) => {
    this.props
      .dispatch({
        type: 'goodsList/deleteSingleGoods',
        payload: {
          id: item.id,
        },
      })
      .then(() => {
        this.handleGetSaleList(this.state.filterSale, this.state.pagesSale, this.state.sortSale);
      });
  };

  // fetch sale
  handleGetSaleList = (filter, pages, sorts) => {
    this.props.dispatch({
      type: 'goodsList/getGoodsSaleList',
      payload: {
        ...filter,
        ...pages,
        sorts,
      },
    });
  };

  // 筛选
  filterPickerChange = (search) => {
    this.props.dispatch({
      type: 'goodsList/setFilterSaleServerData',
      payload: search,
    });
    const filterSale = { ...this.props.goodsList.filterSaleServerData };
    const pagesSale = { ...this.state.pagesSale, page: 1 };
    this.setState({ filterSale, pagesSale });
    this.handleGetSaleList(filterSale, pagesSale, this.state.sortSale);
  };

  // 排序
  handleSelectSortSale = (value) => {
    const sortSale = sortSaleOptions.find((item) => item.name == value.slice(6, value.length))
      .sorts;
    this.setState({ sortSale });
    this.handleGetSaleList(this.state.filterSale, this.state.pagesSale, sortSale);
  };

  handleMoreOperation = (item) => {
    return (
      <div>
        <Link to={`/goods-detail/${item.id}`}>查看</Link>
        <Divider type="vertical" />
        <Link to={`/goods-edit/${item.id}`}>编辑</Link>
        <Divider type="vertical" />
        <Dropdown
          overlay={
            <Menu>
              {item.not_sale == 0 ? (
                <Menu.Item key="1">
                  <Popconfirm
                    title="确认停售此商品?"
                    onConfirm={this.handleSelectGoodStatus.bind(null, item)}>
                    停售
                  </Popconfirm>
                </Menu.Item>
              ) : (
                <Menu.Item key="2">
                  <Popconfirm
                    title="确认解除停售此商品?"
                    onConfirm={this.handleSelectGoodStatus.bind(null, item)}>
                    解除停售
                  </Popconfirm>
                </Menu.Item>
              )}
              <Menu.Item key="3">
                <Popconfirm
                  title="确认删除此商品?"
                  onConfirm={this.handleDeleteSingleGoods.bind(null, item)}>
                  删除
                </Popconfirm>
              </Menu.Item>
            </Menu>
          }>
          <a className="ant-dropdown-link">
            更多<Icon type="down" />
          </a>
        </Dropdown>
      </div>
    );
  };

  render() {
    const { sortSale, pagesSale, filterSale } = this.state;
    const { goodsListSales, goodsSalePagination } = this.props.goodsList;
    let { goodsSaleFilter } = this.props.layoutFilter;

    goodsSaleFilter = goodsSaleFilter.map((cv) => ({
      ...cv,
      multi: cv.code !== 'not_sale',
    }));

    const extra = (
      <Button type="primary" onClick={this.handleToGoodsCreate}>
        新建商品
      </Button>
    );

    const sortSaleExtra = (
      <Select
        style={{ width: 200 }}
        defaultValue="排序方式: 创建时间降序"
        onChange={this.handleSelectSortSale}
        optionLabelProp="value">
        {sortSaleOptions.map((item) => {
          return (
            <Option key={item.id} value={`排序方式: ${item.name}`}>
              {item.name}
            </Option>
          );
        })}
      </Select>
    );

    const salesColumns = [
      {
        title: '',
        dataIndex: 'image',
        width: 60,
        // eslint-disable-next-line
        render: (text, record) =>
          !record.itemimage_names.length ? null : (
            <img src={record.itemimage_names[0]} style={{ width: 42, height: 42 }} alt="未显示" />
          ),
      },
      {
        title: '货号',
        dataIndex: 'item_ref',
        width: '10%',
      },
      {
        title: '标准价',
        dataIndex: 'standard_price',
        width: '15%',
        className: styles.numberRightMove,
        render: (text, record) => NCNF(record.standard_price).format(true),
      },
      {
        title: '销售量',
        dataIndex: 'sales_quantity',
        width: '15%',
        className: styles.numberRightMove,
        render: (text, record) => NCNI(record.sales_quantity).format(true),
      },
      {
        title: '销售额',
        dataIndex: 'sales_amount',
        width: '15%',
        className: styles.numberRightMove,
        render: (text, record) => NCNF(record.sales_amount).format(true),
      },
      {
        title: '库存量',
        dataIndex: 'stock_quantity',
        width: '15%',
        className: styles.numberRightMove,
        render: (text, record) => NCNF(record.stock_quantity).format(true),
      },
      {
        title: '状态',
        width: 100,
        dataIndex: 'not_sale',
        render: (text, record) =>
          record.not_sale == 0 ? (
            <div>
              <span className={styles.onSaleStatus}>• </span>
              <span>在售</span>
            </div>
          ) : (
            <div>
              <span className={styles.stopSaleStatus}>• </span>
              <span>停售</span>
            </div>
          ),
      },
      {
        title: '操作',
        dataIndex: 'operation',
        width: '172px',
        render: (text, record, index) => this.handleMoreOperation(record),
      },
    ];

    const salePagination = {
      pageSize: pagesSale.per_page,
      total: goodsSalePagination.total,
      showQuickJumper: true,
      showSizeChanger: true,
      onChange: (pageNumber, pageSize) => {
        const pagesSale = {
          per_page: pageSize,
          page: pageNumber,
        };
        this.handleGetSaleList(filterSale, pagesSale, sortSale);
        this.setState({ pagesSale });
      },
      onShowSizeChange: (current, size) => {
        const pagesSale = {
          per_page: size,
          page: 1,
        };
        this.handleGetSaleList(filterSale, pagesSale, sortSale);
        this.setState({ pagesSale });
      },
    };

    const breadcrumbList = [
      {
        title: '商品',
      },
      {
        title: '销售',
      },
    ];

    return (
      <PageHeaderLayout
        className={styles.goodsListExtra}
        extraContent={extra}
        breadcrumbList={breadcrumbList}
        onTabChange={this.handleTabChange}>
        <div key="sale">
          {/* <Card bordered={false} className={styles.bottomCardDivided}> */}
          <FilterPicker onChange={this.filterPickerChange} filters={goodsSaleFilter} />
          {/* <FilterDatePick
              onChange={this.handleSaleFilter}
              filterOptions={goodsSaleFilter}
              tagLabel="sale"
              dateLabel="sale"
            /> */}
          {/* </Card> */}
          <Card bordered={false} title="商品" className={styles.goodsList} extra={sortSaleExtra}>
            <Table
              rowKey="id"
              columns={salesColumns}
              dataSource={goodsListSales}
              pagination={salePagination}
            />
            <div style={{ marginTop: -43, width: 300 }}>
              <span>{`共 ${goodsSalePagination.total || ''} 件商品 第 ${
                pagesSale.page
              } / ${Math.ceil(
                Number(goodsSalePagination.total) / Number(pagesSale.per_page),
              )} 页`}</span>
            </div>
          </Card>
        </div>
      </PageHeaderLayout>
    );
  }
}
