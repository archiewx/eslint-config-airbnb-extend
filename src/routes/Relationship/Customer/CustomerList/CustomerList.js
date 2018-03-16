import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { routerRedux,Link } from 'dva/router';
import moment from 'moment';
import currency from 'currency.js'
import { Row, Col, Card, Button, Table,Icon,Select,Menu,Dropdown,Popconfirm,Divider,Spin} from 'antd';
import PageHeaderLayout from '../../../../layouts/PageHeaderLayout';
import FilterDatePick from '../../../../components/FilterDatePick'
import styles from './CustomerList.less'
const NCNF = value => currency(value, { symbol: "", precision: 2 });
const NCNI = value => currency(value, { symbol: "", precision: 0});
const Option = Select.Option;
const breadcrumbList = [{
  title:'关系',
},{
  title:'客户'
}]
const sortOptions = [{
  name:'创建时间降序',
  sorts: {
    created_at: 'desc'
  }
},{
  name:'创建时间升序',
  sorts: {
    created_at: 'asc'
  }
},{
  name:'更新时间降序',
  sorts: {
    updated_at: 'desc'
  }
},{
  name:'更新时间升序',
  sorts: {
    updated_at: 'asc'
  }
},{
  name:'交易笔数降序',
  sorts: {
    trade_count: 'desc'
  }
},{
  name:'交易笔数升序',
  sorts: {
    trade_count: 'asc'
  }
},{
  name:'交易金额降序',
  sorts: {
    trade_amount: 'desc'
  }
},{
  name:'交易金额升序',
  sorts: {
    trade_amount: 'asc'
  }
},{
  name:'欠款金额降序',
  sorts: {
    debt: 'desc'
  }
},{
  name:'欠款金额升序',
  sorts: {
    debt: 'asc'
  }
}]
@connect(({customerList,layoutFilter}) => ({
  customerList,
  layoutFilter,
}))
export default class CustomerList extends PureComponent {

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
  }

  componentDidMount() {
    this.handleGetList(this.state.filter,this.state.pages,this.state.sorts)
    this.props.dispatch({type:'layoutFilter/getLayoutFilter'})
  }

  handleToCustomerCreate = () => {
    this.props.dispatch(routerRedux.push('/relationship/customer-create'))
  }

  handleDeleteSingleCustomer = (id) => {
    this.props.dispatch({type:'customerList/deleteSingle',payload:id}).then(()=>{
      this.handleGetList(this.state.filter,this.state.pages,this.state.sorts)
    })
  }

  handleChangeCustomerStatus = (id,status) => {
    this.props.dispatch({type:'customerList/changeCustomerStatus',payload:{
      id,
      freeze: status
    }}).then(()=>{
       this.handleGetList(this.state.filter,this.state.pages,this.state.sorts)
    })
  }

  handleGetList = ( filter,pages,sorts ) => {
    this.props.dispatch({type:'customerList/getList',payload:{
      ...filter,
      ...pages,
      sorts,
    }})
  }

  handleSelectSort = (value) => {
    const sorts = sortOptions.find( item => item.name == value.slice(6,value.length)).sorts;
    this.setState({sorts})
    this.handleGetList(this.state.filter,this.state.pages,sorts)
  }

  handleFilter = (value) => {
    this.props.dispatch({type:'customerList/setFilterCustomerServerData',payload:{
      ...value,
      datePick: value['datePick'] ? [value['datePick'][0].format('YYYY-MM-DD'),value['datePick'][1].format('YYYY-MM-DD')] : undefined
    }})
    const filter = this.props.customerList.fifterCustomerServerData;
    const pages = {...this.state.pages,page:1};
    this.setState({filter,pages});
    this.handleGetList(filter,pages,this.state.sorts)
  }

  handleMoreOperation = (item) => {
    return (
      <div>
        <Link to={`/relationship/customer-detail/${item.id}`}>查看</Link>
        <Divider type='vertical' />
        <Link to={`/relationship/customer-edit/${item.id}`}>编辑</Link>
        <Divider  type='vertical' />
        <Dropdown overlay={    
          <Menu>
            { item.freeze == 0 ? (
              <Menu.Item key="1"><Popconfirm title="确认冻结此客户?" onConfirm={this.handleChangeCustomerStatus.bind(null,item.id,1)}>冻结</Popconfirm></Menu.Item>
              ) : (
                <Menu.Item key="2"><Popconfirm title="确认解除冻结此客户?" onConfirm={this.handleChangeCustomerStatus.bind(null,item.id,0)}>解除冻结</Popconfirm></Menu.Item>
              )}
            <Menu.Item key="3"><Popconfirm title="确认删除此客户?" onConfirm={this.handleDeleteSingleCustomer.bind(null,item.id)}>删除</Popconfirm></Menu.Item>
          </Menu>
        }>
        <a className="ant-dropdown-link">更多<Icon type="down" /></a>
        </Dropdown>
      </div>
    )
  }

  render() {
    const {customerList: {customerList,customerPagination} , layoutFilter: {customerFilter}} = this.props;
    const {sorts,pages,filter} = this.state;

    const headerExtra = (
      <Button type='primary' onClick={this.handleToCustomerCreate}>新建客户</Button>
    )

    const tableSortExtra = (
      <Select style={{ width: 200 }}  defaultValue={'排序方式: 创建时间降序'} onChange={this.handleSelectSort} optionLabelProp='value'>
        {
          sortOptions.map( (item,index) => {
            return <Option key={index} value={`排序方式: ${item.name}`}>{item.name}</Option>
          })
        }
      </Select>
    )

    const columns = [{
      title: '姓名',
      dataIndex: 'name',
      width:'15%'
    }, {
      title: '交易笔数',
      dataIndex: 'trade_count',
      className: styles['numberRightMove'],
      render: (text,record) => NCNI(record.trade_count).format(true)
    }, {
      title: '交易金额',
      dataIndex: 'trade_amount',
      width:'25%',
      className: styles['numberRightMove'],
      render: (text,record) => NCNF(record.trade_amount).format(true)
    }, {
      title: '欠款金额',
      dataIndex: 'debt',
      className: styles['numberRightMove'],
      render: (text,record) => NCNF(record.debt).format(true)
    }, {
      title: '操作',
      dataIndex: 'operation',
      width:'172px',
      render: (text,record,index) =>( this.handleMoreOperation(record) )
    }];

    const pagination = {
      pageSize:pages.per_page,
      current:pages.page,
      total:customerPagination.total,
      showQuickJumper:true,
      showSizeChanger:true,
      onChange:( page,pageSize ) => {
        const pages = {
          per_page:pageSize,
          page:page
        }
        this.setState({pages})
        this.handleGetList(filter,pages,sorts)
      },
      onShowSizeChange: ( current,size) => {
        const pages = {
          per_page:size,
          page:1
        }
        this.setState({pages})
        this.handleGetList(filter,pages,sorts)
      }
    }

    return (
      <PageHeaderLayout
        extraContent={headerExtra}
        className={styles.customerListExtra}
        breadcrumbList={breadcrumbList}
        >
        <Card bordered={false} className={styles.bottomCardDivided}>
          <FilterDatePick onChange={this.handleFilter} filterOptions = {customerFilter} defaultDate = {[moment(new Date((new Date).getTime() - 7*24*60*60*1000),'YYYY-MM-DD'),moment(new Date(),'YYYY-MM-DD')]}  />
        </Card>
        <Card bordered={false} title='客户列表' extra={tableSortExtra}>
          <Table 
            rowKey='id'
            columns={columns} 
            dataSource={customerList} 
            pagination={pagination}
          />
          <div style={{marginTop:-43,width:300}}>
            <span>{`共 ${customerPagination.total || ''} 位客户 第 ${pages.page} / ${Math.ceil(Number(customerPagination.total)/Number(pages.per_page))} 页`}</span>
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}
