import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { routerRedux,Link } from 'dva/router';
import moment from 'moment';
import currency from 'currency.js'
import { Row, Col, Card, Button, Table,Icon,Select,Menu,Dropdown,Popconfirm,Divider,Form,DatePicker,Spin} from 'antd';
import PageHeaderLayout from '../../../../layouts/PageHeaderLayout';
import FilterDatePick from '../../../../components/FilterDatePick'
import styles from './PaymentsList.less'
const NCNF = value => currency(value, { symbol: "", precision: 2 });
const Option = Select.Option;
const { RangePicker } = DatePicker;
const breadcrumbList = [{
  title:'财务',
},{
  title:'流水'
}]
const sortOptions = [{
  name:'创建时间降序',
  id:1,
  sorts: {
    created_at: 'desc'
  },
  type: 'created_at',
},{
  name:'创建时间升序',
  id:2,
  sorts: {
    created_at: 'asc'
  },
  type: 'created_at',
},{
  name:'金额降序',
  id:3,
  sorts: {
    value: 'desc'
  },
  type: 'value',
},{
  name:'金额升序',
  id:4,
  sorts: {
    value: 'asc'
  },
  type: 'value',
}]
const condition = {
  sorts: {
    created_at: 'desc'
  },
  page:1,
  per_page:10,
  date_type:'custom',
  sday:moment(new Date((new Date).getTime() - 7*24*60*60*1000),'YYYY-MM-DD').format('YYYY-MM-DD'),
  eday:moment(new Date(),'YYYY-MM-DD').format('YYYY-MM-DD')
}
@connect(state => ({
  paymentsList:state.paymentsList,
  layoutFilter:state.layoutFilter
}))
export default class PaymentsList extends PureComponent {

  state = {
    sorts: {
      created_at: 'desc'
    },
    pages: {
      per_page: 10,
      page: 1,
    },
    filter:{
      date_type:'custom',
      sday: moment(new Date((new Date).getTime() - 7*24*60*60*1000),'YYYY-MM-DD').format('YYYY-MM-DD'),
      eday: moment(new Date(),'YYYY-MM-DD').format('YYYY-MM-DD'),
    },
    sortOrder: {
      created_at: 'descend'
    },
    sortValue: '排序方式: 创建时间降序'
  }

  componentDidMount() {
    this.props.dispatch({type:'paymentsList/getList',payload:{...condition}})
    this.props.dispatch({type:'layoutFilter/getLayoutFilter'})
  }

  // 获取
  handleGetList = ( filter,pages,sorts ) => {
    this.props.dispatch({type:'paymentsList/getList',payload:{
      ...filter,
      ...pages,
      sorts,
    }})
  }

  // 删除
  handleDeleteSingle = (id) => {
    this.props.dispatch({type:'paymentsList/deleteSingle',payload:id}).then(()=>{
      this.handleGetList(this.state.filter,this.state.pages,this.state.sorts)
    })
  }

  handlSortTable = (pagination, filters, sorter) => {
    const pages = {
      per_page: pagination.pageSize,
      page: pagination.current,
    }
    if(sorter.order) {
      const sorts = {
        [`${sorter.field}`] : sorter.order.slice(0,sorter.order.length-3)
      };
      const sortOrder = {
        [`${sorter.field}`] : sorter.order
      };
      const sortValue = `排序方式: ${sortOptions.find( n => n.type == sorter.field && n['sorts'][sorter.field] == sorter.order.slice(0,sorter.order.length-3) ).name}`;
      this.setState({sorts,sortOrder,sortValue,pages})
      this.handleGetList(this.state.filter,pages,sorts)
    }else {
      const sorts = {
        created_at: 'desc'
      };
      const sortOrder = {
        created_at: 'descend'
      };
      const sortValue = '排序方式: 创建时间降序';
      this.setState({sorts,sortOrder,sortValue,pages})
      this.handleGetList(this.state.filter,pages,sorts)
    }
  }

  // 排序
  handleSelectSort = (value) => {
    const sortOption = sortOptions.find( item => item.name == value.slice(6,value.length))
    const sorts = sortOption.sorts;
    const sortValue = `排序方式: ${sortOption.name}`;
    const sortOrder = {...sorts};
    sortOrder[sortOption.type] += 'end';
    this.setState({sorts,sortOrder,sortValue});
    this.handleGetList(this.state.filter,this.state.pages,sorts)
  }

  // 筛选
  handleFilter = (value) => {
    this.props.dispatch({type:'paymentsList/setFilterpaymentsListServerData',payload:{
      ...value,
      datePick: value['datePick'] ? [value['datePick'][0].format('YYYY-MM-DD'),value['datePick'][1].format('YYYY-MM-DD')] : undefined
    }})
    const filter = this.props.paymentsList.fifterpaymentsListServerData;
    const pages = {...this.state.pages,page:1}
    this.setState({filter,pages})
    this.handleGetList(filter,pages,this.state.sorts)
  }

  handleMoreOperation = (item) => {
    return (
      <div>
        <Link to={`/finance/payments-detail/${item.id}`}>查看</Link>
        <Divider  type='vertical' />
        <Dropdown overlay={    
          <Menu>
              <Menu.Item key="1"><Popconfirm title="确认删除此流水?" onConfirm={this.handleDeleteSingle.bind(null,item.id)}>删除</Popconfirm></Menu.Item>
          </Menu>
        }>
        <a className="ant-dropdown-link">更多<Icon type="down" /></a>
        </Dropdown>
      </div>
    )
  }

  render() {
    const {paymentsList: {paymentsList,paymentsPagination}  , layoutFilter: {paymentsFilter}} = this.props;
    const {sorts,pages,filter,sortOrder,sortValue} = this.state;

    const tableSortExtra = (
      <Select style={{ width: 200 }}  value={sortValue} onChange={this.handleSelectSort} optionLabelProp='value'>
        {
          sortOptions.map( item => {
            return <Option key={item.id} value={`排序方式: ${item.name}`}>{item.name}</Option>
          })
        }
      </Select>
    )

    const columns = [{
      title: '流水号',
      dataIndex: 'number',
      render: (text,record) => `#${record.number}`
    }, {
      title: '交易对象',
      dataIndex: 'payer',
      width:'20%',
      render: (text,record) => `${record.payer.data.name}`
    }, {
      title: '支付方式',
      dataIndex: 'paymentmethod',
      width:'15%',
      render: (text,record) => `${record.paymentmethod.data.name}`
    }, {
      title: '金额',
      dataIndex: 'value',
      sorter:true,
      sortOrder: sortOrder.value || false,
      className: styles['numberRightMove'],
      render: (text,record) => NCNF(record.value).format(true)
    }, {
      title: '创建时间',
      width:'20%',
      sorter:true,
      sortOrder: sortOrder.created_at || false,
      dataIndex: 'created_at',
    }, {
      title: '操作',
      dataIndex: 'operation',
      width:'172px',
      render: (text,record,index) =>( this.handleMoreOperation(record) )
    }];

    const pagination = {
      pageSize:pages.per_page,
      current:pages.page,
      total:paymentsPagination.total,
      showQuickJumper:true,
      showSizeChanger:true,
    }

    return (
      <PageHeaderLayout breadcrumbList={breadcrumbList}>
        <Card bordered={false} className={styles.bottomCardDivided}>
          <FilterDatePick onChange={this.handleFilter} filterOptions = {paymentsFilter}/>
        </Card>
        <Card bordered={false} title='流水列表' extra={tableSortExtra}>
          <Table 
            rowKey='id'
            columns={columns} 
            dataSource={paymentsList} 
            pagination={pagination}
            onChange={this.handlSortTable}
          />
          <div style={{marginTop:-43,width:300}}>
            <span>{`共 ${paymentsPagination.total || ''} 条流水 第 ${pages.page} / ${Math.ceil(Number(paymentsPagination.total)/Number(pages.per_page))} 页`}</span>
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}
