import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { routerRedux, Link } from 'dva/router';
import moment from 'moment';
import currency from 'currency.js';
import {
  Row,
  Col,
  Card,
  Button,
  Table,
  Icon,
  Select,
  Menu,
  Dropdown,
  Popconfirm,
  Divider,
  Form,
  DatePicker,
  Spin,
} from 'antd';
import PageHeaderLayout from '../../../../layouts/PageHeaderLayout';
import FilterDatePick from '../../../../components/FilterDatePick';
import styles from './InventoryOrderList.less';
import FilterPicker from '../../../../components/FilterPicker/FilterPicker';

const NCNF = (value) => currency(value, { symbol: '', precision: 2 });
const NCNI = (value) => currency(value, { symbol: '', precision: 0 });
const Option = Select.Option;
const breadcrumbList = [
  {
    title: '单据',
  },
  {
    title: '盘点单',
  },
];
const sortOptions = [
  {
    name: '创建时间降序',
    id: 1,
    sorts: {
      created_at: 'desc',
    },
    type: 'created_at',
  },
  {
    name: '创建时间升序',
    id: 2,
    sorts: {
      created_at: 'asc',
    },
    type: 'created_at',
  },
  {
    name: '盘亏数量降序',
    id: 3,
    sorts: {
      losses_quantity: 'desc',
    },
    type: 'losses_quantity',
  },
  {
    name: '盘亏数量升序',
    id: 4,
    sorts: {
      losses_quantity: 'asc',
    },
    type: 'losses_quantity',
  },
  {
    name: '盘亏价值降序',
    id: 5,
    sorts: {
      losses_amount: 'desc',
    },
    type: 'losses_amount',
  },
  {
    name: '盘亏价值升序',
    id: 6,
    sorts: {
      losses_amount: 'asc',
    },
    type: 'losses_amount',
  },
  {
    name: '盘盈数量降序',
    id: 7,
    sorts: {
      profit_quantity: 'desc',
    },
    type: 'profit_quantity',
  },
  {
    name: '盘盈数量升序',
    id: 8,
    sorts: {
      profit_quantity: 'asc',
    },
    type: 'profit_quantity',
  },
  {
    name: '盘盈价值降序',
    id: 9,
    sorts: {
      profit_amount: 'desc',
    },
    type: 'profit_amount',
  },
  {
    name: '盘盈价值升序',
    id: 10,
    sorts: {
      profit_amount: 'asc',
    },
    type: 'profit_amount',
  },
];
const condition = {
  sorts: {
    created_at: 'desc',
  },
  page: 1,
  per_page: 10,
  date_type: 'custom',
  sday: moment(new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000), 'YYYY-MM-DD').format(
    'YYYY-MM-DD',
  ),
  eday: moment(new Date(), 'YYYY-MM-DD').format('YYYY-MM-DD'),
};
@connect((state) => ({
  inventoryOrderList: state.inventoryOrderList,
  layoutFilter: state.layoutFilter,
}))
export default class InventoryOrderList extends PureComponent {
  state = {
    sorts: {
      created_at: 'desc',
    },
    pages: {
      per_page: 10,
      page: 1,
    },
    filter: {
      date_type: 'custom',
      sday: moment(new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000), 'YYYY-MM-DD').format(
        'YYYY-MM-DD',
      ),
      eday: moment(new Date(), 'YYYY-MM-DD').format('YYYY-MM-DD'),
    },
    sortOrder: {
      created_at: 'descend',
    },
    sortValue: '排序方式: 创建时间降序',
  };

  componentDidMount() {
    this.props.dispatch({ type: 'inventoryOrderList/getList', payload: { ...condition } });
    this.props.dispatch({ type: 'layoutFilter/getLayoutFilter' });
  }

  // 获取
  handleGetList = (filter, pages, sorts) => {
    this.props.dispatch({
      type: 'inventoryOrderList/getList',
      payload: {
        ...filter,
        ...pages,
        sorts,
      },
    });
  };

  // 删除
  handleDeleteSingle = (id) => {
    this.props.dispatch({ type: 'inventoryOrderList/deleteSingle', payload: id }).then(() => {
      this.handleGetList(this.state.filter, this.state.pages, this.state.sorts);
    });
  };

  // 排序选择
  handleSelectSort = (value) => {
    const sortOption = sortOptions.find((item) => item.name == value.slice(6, value.length));
    const sorts = sortOption.sorts;
    const sortValue = `排序方式: ${sortOption.name}`;
    const sortOrder = { ...sorts };
    sortOrder[sortOption.type] += 'end';
    this.setState({ sorts, sortOrder, sortValue });
    this.handleGetList(this.state.filter, this.state.pages, sorts);
  };

  // 排序Table
  handlSortTable = (pagination, filters, sorter) => {
    const pages = {
      per_page: pagination.pageSize,
      page: pagination.current,
    };
    if (sorter.order) {
      const sorts = {
        [`${sorter.field}`]: sorter.order.slice(0, sorter.order.length - 3),
      };
      const sortOrder = {
        [`${sorter.field}`]: sorter.order,
      };
      const sortValue = `排序方式: ${
        sortOptions.find(
          (n) =>
            n.type == sorter.field &&
            n.sorts[sorter.field] == sorter.order.slice(0, sorter.order.length - 3),
        ).name
      }`;
      this.setState({ sorts, sortOrder, sortValue, pages });
      this.handleGetList(this.state.filter, pages, sorts);
    } else {
      const sorts = {
        created_at: 'desc',
      };
      const sortOrder = {
        created_at: 'descend',
      };
      const sortValue = '排序方式: 创建时间降序';
      this.setState({ sorts, sortOrder, sortValue, pages });
      this.handleGetList(this.state.filter, pages, sorts);
    }
  };

  // 筛选
  handleFilter = (search) => {
    this.props.dispatch({
      type: 'inventoryOrderList/setFilterSaleOrderServerData',
      payload: search,
    });
    const filter = { ...this.props.inventoryOrderList.fifterInventoryOrderServerData };
    const pages = { ...this.state.pages, page: 1 };
    this.setState({ filter, pages });
    this.handleGetList(filter, pages, this.state.sorts);
  };

  handleMoreOperation = (item) => {
    return (
      <div>
        <Link to={`/bill/inventory-detail/${item.id}`}>查看</Link>
        <Divider type="vertical" />
        <Dropdown
          overlay={
            <Menu>
              <Menu.Item key="1">
                <Popconfirm
                  title="确认删除此盘点单?"
                  onConfirm={this.handleDeleteSingle.bind(null, item.id)}>
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
    const {
      inventoryOrderList: { inventoryOrderList, inventoryOrderPagination },
      layoutFilter,
    } = this.props;
    let { inventoryOrderFilter } = layoutFilter;
    const { sorts, pages, filter, sortOrder, sortValue } = this.state;

    inventoryOrderFilter = inventoryOrderFilter.map((cv) => ({
      ...cv,
      multi: cv.code !== 'status', // 支付状态单选
    }));

    const tableSortExtra = (
      <Select
        style={{ width: 200 }}
        value={sortValue}
        onChange={this.handleSelectSort}
        optionLabelProp="value">
        {sortOptions.map((item) => {
          return (
            <Option key={item.id} value={`排序方式: ${item.name}`}>
              {item.name}
            </Option>
          );
        })}
      </Select>
    );

    const columns = [
      {
        title: '单号',
        dataIndex: 'number',
        width: '12%',
        render: (text, record) => `#${record.number}`,
      },
      {
        title: '盘亏数量',
        dataIndex: 'losses_quantity',
        width: '14%',
        className: styles.numberRightMove,
        sorter: true,
        sortOrder: sortOrder.losses_quantity || false,
        render: (text, record) => NCNI(record.losses_quantity).format(true),
      },
      {
        title: '盘亏价值',
        dataIndex: 'losses_amount',
        width: '14%',
        className: styles.numberRightMove,
        sorter: true,
        sortOrder: sortOrder.losses_amount || false,
        render: (text, record) => NCNF(record.losses_amount).format(true),
      },
      {
        title: '盘盈数量',
        dataIndex: 'profit_quantity',
        width: '14%',
        className: styles.numberRightMove,
        sorter: true,
        sortOrder: sortOrder.profit_quantity || false,
        render: (text, record) => NCNI(record.profit_quantity).format(true),
      },
      {
        title: '盘盈价值',
        dataIndex: 'profit_amount',
        className: styles.numberRightMove,
        width: '14%',
        sorter: true,
        sortOrder: sortOrder.profit_amount || false,
        render: (text, record) => NCNF(record.profit_amount).format(true),
      },
      {
        title: '创建时间',
        dataIndex: 'created_at',
        sorter: true,
        sortOrder: sortOrder.created_at || false,
      },
      {
        title: '操作',
        dataIndex: 'operation',
        width: '172px',
        render: (text, record, index) => this.handleMoreOperation(record),
      },
    ];

    const pagination = {
      pageSize: pages.per_page,
      current: pages.page,
      total: inventoryOrderPagination.total,
      showQuickJumper: true,
      showSizeChanger: true,
    };

    return (
      <PageHeaderLayout breadcrumbList={breadcrumbList}>
        {/* <Card bordered={false} className={styles.bottomCardDivided}>
          <FilterDatePick onChange={this.handleFilter} filterOptions={inventoryOrderFilter} />
        </Card> */}
        <FilterPicker onChange={this.handleFilter} filters={inventoryOrderFilter} />
        <Card bordered={false} title="盘点单列表" extra={tableSortExtra}>
          <Table
            rowKey="id"
            columns={columns}
            dataSource={inventoryOrderList}
            pagination={pagination}
            onChange={this.handlSortTable}
          />
          <div style={{ marginTop: -43, width: 300 }}>
            <span>{`共 ${inventoryOrderPagination.total || ''} 条盘点单 第 ${
              pages.page
            } / ${Math.ceil(
              Number(inventoryOrderPagination.total) / Number(pages.per_page),
            )} 页`}</span>
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}
