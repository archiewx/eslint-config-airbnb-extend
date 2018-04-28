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
  Modal,
} from 'antd';
import PageHeaderLayout from '../../../../layouts/PageHeaderLayout';
import FilterDatePick from '../../../../components/FilterDatePick';
import styles from './PurchaseOrderList.less';
import FilterPicker from '../../../../components/FilterPicker/FilterPicker';

const NCNF = (value) => currency(value, { symbol: '', precision: 2 });
const NCNI = (value) => currency(value, { symbol: '', precision: 0 });
const Option = Select.Option;
let confirmModal;
const { againModalConfirm } = styles;
const breadcrumbList = [
  {
    title: '单据',
  },
  {
    title: '进货单',
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
    name: '商品数量降序',
    id: 3,
    sorts: {
      total_quantity: 'desc',
    },
    type: 'total_quantity',
  },
  {
    name: '商品数量升序',
    id: 4,
    sorts: {
      total_quantity: 'asc',
    },
    type: 'total_quantity',
  },
  {
    name: '总额降序',
    id: 5,
    sorts: {
      due_fee: 'desc',
    },
    type: 'due_fee',
  },
  {
    name: '总额升序',
    id: 6,
    sorts: {
      due_fee: 'asc',
    },
    type: 'due_fee',
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
  purchaseOrderList: state.purchaseOrderList,
  layoutFilter: state.layoutFilter,
}))
export default class PurchaseOrderList extends PureComponent {
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
    this.props.dispatch({ type: 'purchaseOrderList/getList', payload: { ...condition } });
    this.props.dispatch({ type: 'layoutFilter/getLayoutFilter' });
  }

  // 获取
  handleGetList = (filter, pages, sorts) => {
    this.props.dispatch({
      type: 'purchaseOrderList/getList',
      payload: {
        ...filter,
        ...pages,
        sorts,
      },
    });
  };

  // 删除
  handleDeleteSingle = (id, deal) => {
    if (deal != -1) {
      confirmModal.destroy();
      this.props
        .dispatch({
          type: 'purchaseOrderList/deleteSingle',
          payload: {
            id,
            deal_payments: deal,
          },
        })
        .then(() => {
          this.handleGetList(this.state.filter, this.state.pages, this.state.sorts);
        });
    } else {
      this.props
        .dispatch({
          type: 'purchaseOrderList/deleteSingle',
          payload: {
            id,
          },
        })
        .then(() => {
          this.handleGetList(this.state.filter, this.state.pages, this.state.sorts);
        });
    }
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
      this.setState({ sorts, sortOrder, sortValue });
      this.handleGetList(this.state.filter, pages, sorts);
    } else {
      const sorts = {
        created_at: 'desc',
      };
      const sortOrder = {
        created_at: 'descend',
      };
      const sortValue = '排序方式: 创建时间降序';
      this.setState({ sorts, sortOrder, sortValue });
      this.handleGetList(this.state.filter, pages, sorts);
    }
  };

  // 筛选
  handleFilter = (search) => {
    this.props.dispatch({
      type: 'purchaseOrderList/setFilterSaleOrderServerData',
      payload: search,
    });
    const filter = { ...this.props.purchaseOrderList.fifterPurchaseOrderServerData };
    const pages = { ...this.state.pages, page: 1 };
    this.setState({ filter, pages });
    this.handleGetList(filter, pages, this.state.sorts);
  };

  // 删除一次选择
  handleDeletePopConfirm = (settleWay, payStatus, id) => {
    let popconfirmModal;
    if (settleWay == 1) {
      popconfirmModal = (
        <Popconfirm
          title={
            <div>
              <span>确认删除此进货单?</span>
              <div style={{ color: 'red' }}>关联的流水也将一同删除</div>
            </div>
          }
          okText="继续"
          onConfirm={this.handleAgianPopConfirm.bind(null, id)}>
          删除
        </Popconfirm>
      );
    } else if (payStatus == 1) {
      popconfirmModal = (
        <Popconfirm
          title={
            <div>
              <span>确认删除此进货单?</span>
            </div>
          }
          okText="确认"
          onConfirm={this.handleDeleteSingle.bind(null, id, -1)}>
          删除
        </Popconfirm>
      );
    } else if (payStatus == 3) {
      popconfirmModal = (
        <Popconfirm
          title={
            <div>
              <span>进货单已结算，无法删除</span>
            </div>
          }
          okText="确认">
          删除
        </Popconfirm>
      );
    }
    return popconfirmModal;
  };

  // 删除二次选择
  handleAgianPopConfirm = (id) => {
    confirmModal = Modal.confirm({
      className: againModalConfirm,
      title: '关联的流水将如何处理',
      content: (
        <Button
          type="primary"
          className={styles.paymentsPositon}
          onClick={this.handleDeleteSingle.bind(null, id, 2)}>
          充值到余额
        </Button>
      ),
      okText: '删除流水',
      onOk: () => {
        this.handleDeleteSingle(id, 1);
      },
    });
  };

  handleMoreOperation = (item) => {
    return (
      <div>
        <Link to={`/bill/purchase-detail/${item.id}`}>查看</Link>
        <Divider type="vertical" />
        <Dropdown
          overlay={
            <Menu>
              <Menu.Item key="1">
                {this.handleDeletePopConfirm(item.settle_way, item.pay_status, item.id)}
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
      purchaseOrderList: { purchaseOrderList, purchaseOrderPagination },
      layoutFilter,
    } = this.props;
    const { purchaseOrderFilter } = layoutFilter;
    const { sorts, pages, filter, sortOrder, sortValue } = this.state;

    const radios = ['settle_way', 'pay_status', 'delivery_status'];

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
        width: '15%',
        render: (text, record) => `#${record.number}`,
      },
      {
        title: '交易供应商',
        dataIndex: 'sale_customer',
        width: '15%',
        render: (text, record) => `${record.supplier.data.name}`,
      },
      {
        title: '商品数量',
        dataIndex: 'total_quantity',
        width: '15%',
        className: styles.numberRightMove,
        sorter: true,
        sortOrder: sortOrder.total_quantity || false,
        render: (text, record) => NCNI(record.total_quantity).format(true),
      },
      {
        title: '总额',
        dataIndex: 'due_fee',
        className: styles.numberRightMove,
        sorter: true,
        sortOrder: sortOrder.due_fee || false,
        render: (text, record) => NCNF(record.due_fee).format(true),
      },
      {
        title: '创建时间',
        dataIndex: 'created_at',
        width: '20%',
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
      total: purchaseOrderPagination.total,
      showQuickJumper: true,
      showSizeChanger: true,
    };

    return (
      <PageHeaderLayout breadcrumbList={breadcrumbList}>
        {/* <Card bordered={false} className={styles.bottomCardDivided}>
          <FilterDatePick onChange={this.handleFilter} filterOptions={purchaseOrderFilter} />
        </Card> */}
        <FilterPicker onChange={this.handleFilter} filters={purchaseOrderFilter} radios={radios} />
        <Card bordered={false} title="进货单列表" extra={tableSortExtra}>
          <Table
            rowKey="id"
            columns={columns}
            dataSource={purchaseOrderList}
            pagination={pagination}
            onChange={this.handlSortTable}
          />
          <div style={{ marginTop: -43, width: 300 }}>
            <span>{`共 ${pagination.total || ''} 条进货单 第 ${pages.page} / ${Math.ceil(
              Number(pagination.total) / Number(pages.per_page),
            )} 页`}</span>
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}
