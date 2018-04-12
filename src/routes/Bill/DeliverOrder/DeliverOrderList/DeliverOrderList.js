import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { routerRedux, Link } from 'dva/router';
import moment from 'moment';
import currency from 'currency.js';
import { Row, Col, Card, Button, Table, Icon, Select, Menu, Dropdown, Popconfirm, Divider, Form, DatePicker, Spin } from 'antd';
import PageHeaderLayout from '../../../../layouts/PageHeaderLayout';
import FilterDatePick from '../../../../components/FilterDatePick';
import styles from './DeliverOrderList.less';

const NCNF = value => currency(value, { symbol: '', precision: 2 });
const NCNI = value => currency(value, { symbol: '', precision: 0 });
const Option = Select.Option;
const breadcrumbList = [{
  title: '单据',
}, {
  title: '调货单',
}];
const sortOptions = [{
  name: '创建时间降序',
  id: 1,
  sorts: {
    created_at: 'desc',
  },
  type: 'created_at',
}, {
  name: '创建时间升序',
  id: 2,
  sorts: {
    created_at: 'asc',
  },
  type: 'created_at',
}, {
  name: '商品项数降序',
  id: 3,
  sorts: {
    count: 'desc',
  },
  type: 'count',
}, {
  name: '商品项数升序',
  id: 4,
  sorts: {
    count: 'asc',
  },
  type: 'count',
}, {
  name: '商品数量降序',
  id: 5,
  sorts: {
    total_quantity: 'desc',
  },
  type: 'total_quantity',
}, {
  name: '商品数量升序',
  id: 6,
  sorts: {
    total_quantity: 'asc',
  },
  type: 'total_quantity',
}];
const condition = {
  sorts: {
    created_at: 'desc',
  },
  page: 1,
  per_page: 10,
  date_type: 'custom',
  sday: moment(new Date((new Date()).getTime() - 7 * 24 * 60 * 60 * 1000), 'YYYY-MM-DD').format('YYYY-MM-DD'),
  eday: moment(new Date(), 'YYYY-MM-DD').format('YYYY-MM-DD'),
};
@connect(state => ({
  deliverOrderList: state.deliverOrderList,
  layoutFilter: state.layoutFilter,
}))
export default class DeliverOrderList extends PureComponent {
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
      sday: moment(new Date((new Date()).getTime() - 7 * 24 * 60 * 60 * 1000), 'YYYY-MM-DD').format('YYYY-MM-DD'),
      eday: moment(new Date(), 'YYYY-MM-DD').format('YYYY-MM-DD'),
    },
    sortOrder: {
      created_at: 'descend',
    },
    sortValue: '排序方式: 创建时间降序',
  }

  componentDidMount() {
    this.props.dispatch({ type: 'deliverOrderList/getList', payload: { ...condition } });
    this.props.dispatch({ type: 'layoutFilter/getLayoutFilter' });
  }

  // 获取
  handleGetList = (filter, pages, sorts) => {
    this.props.dispatch({ type: 'deliverOrderList/getList',
      payload: {
        ...filter,
        ...pages,
        sorts,
      } });
  }

  // 删除
  handleDeleteSingle = (id) => {
    this.props.dispatch({ type: 'deliverOrderList/deleteSingle', payload: id }).then(() => {
      this.handleGetList(this.state.filter, this.state.pages, this.state.sorts);
    });
  }

  // 排序选择
  handleSelectSort = (value) => {
    const sortOption = sortOptions.find(item => item.name == value.slice(6, value.length));
    const sorts = sortOption.sorts;
    const sortValue = `排序方式: ${sortOption.name}`;
    const sortOrder = { ...sorts };
    sortOrder[sortOption.type] += 'end';
    this.setState({ sorts, sortOrder, sortValue });
    this.handleGetList(this.state.filter, this.state.pages, sorts);
  }

  // 排序table
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
      const sortValue = `排序方式: ${sortOptions.find(n => n.type == sorter.field && n.sorts[sorter.field] == sorter.order.slice(0, sorter.order.length - 3)).name}`;
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
  }

  // 筛选
  handleFilter = (value) => {
    this.props.dispatch({ type: 'deliverOrderList/setFilterSaleOrderServerData',
      payload: {
        ...value,
        datePick: value.datePick ? [value.datePick[0].format('YYYY-MM-DD'), value.datePick[1].format('YYYY-MM-DD')] : undefined,
      } });
    const filter = { ...this.props.deliverOrderList.fifterDeliverOrderServerData };
    const pages = { ...this.state.pages, page: 1 };
    this.setState({ filter, pages });
    this.handleGetList(filter, pages, this.state.sorts);
  }

  handleMoreOperation = (item) => {
    return (
      <div>
        <Link to={`/bill/deliver-detail/${item.id}`}>查看</Link>
        <Divider type="vertical" />
        <Dropdown overlay={
          <Menu>
            <Menu.Item key="1"><Popconfirm title="确认删除此调货单?" onConfirm={this.handleDeleteSingle.bind(null, item.id)}>删除</Popconfirm></Menu.Item>
          </Menu>
        }
        >
          <a className="ant-dropdown-link">更多<Icon type="down" /></a>
        </Dropdown>
      </div>
    );
  }

  render() {
    const { deliverOrderList: { deliverOrderList, deliverOrderPagination }, layoutFilter } = this.props;
    let { deliverOrderFilter } = layoutFilter;
    const { sorts, pages, filter, sortOrder, sortValue } = this.state;

    deliverOrderFilter = deliverOrderFilter.map(cv => ({
      ...cv,
      multi: cv.code !== 'delivery_status' && cv.code !== 'receive_status',
    }));

    const tableSortExtra = (
      <Select style={{ width: 200 }} value={sortValue} onChange={this.handleSelectSort} optionLabelProp="value">
        {
          sortOptions.map((item) => {
            return <Option key={item.id} value={`排序方式: ${item.name}`}>{item.name}</Option>;
          })
        }
      </Select>
    );

    const columns = [{
      title: '单号',
      dataIndex: 'number',
      width: '12%',
      render: (text, record) => `#${record.number}`,
    }, {
      title: '出货仓库',
      dataIndex: 'fromwarehouse',
      width: '12%',
      render: (text, record) => `${record.fromwarehouse.data.name}`,
    }, {
      title: '入货仓库',
      dataIndex: 'towarehouse',
      width: '12%',
      render: (text, record) => `${record.towarehouse.data.name}`,
    }, {
      title: '商品项数',
      dataIndex: 'count',
      className: styles.numberRightMove,
      sorter: true,
      sortOrder: sortOrder.count || false,
      render: (text, record) => NCNI(record.count).format(true),
    }, {
      title: '商品数量',
      dataIndex: 'total_quantity',
      width: '14%',
      className: styles.numberRightMove,
      sorter: true,
      sortOrder: sortOrder.total_quantity || false,
      render: (text, record) => NCNI(record.total_quantity).format(true),
    }, {
      title: '创建时间',
      dataIndex: 'created_at',
      sorter: true,
      sortOrder: sortOrder.created_at || false,
      width: '18%',
    }, {
      title: '操作',
      dataIndex: 'operation',
      width: '172px',
      render: (text, record, index) => (this.handleMoreOperation(record)),
    }];

    const pagination = {
      pageSize: pages.per_page,
      current: pages.page,
      total: deliverOrderPagination.total,
      showQuickJumper: true,
      showSizeChanger: true,
    };

    return (
      <PageHeaderLayout breadcrumbList={breadcrumbList}>
        <Card bordered={false} className={styles.bottomCardDivided}>
          <FilterDatePick onChange={this.handleFilter} filterOptions={deliverOrderFilter} />
        </Card>
        <Card bordered={false} title="调货单列表" extra={tableSortExtra}>
          <Table
            rowKey="id"
            columns={columns}
            dataSource={deliverOrderList}
            pagination={pagination}
            onChange={this.handlSortTable}
          />
          <div style={{ marginTop: -43, width: 300 }}>
            <span>{`共 ${deliverOrderPagination.total || ''} 条调货单 第 ${pages.page} / ${Math.ceil(Number(deliverOrderPagination.total) / Number(pages.per_page))} 页`}</span>
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}
