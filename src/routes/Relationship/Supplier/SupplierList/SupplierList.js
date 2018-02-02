import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { routerRedux,Link } from 'dva/router';
import moment from 'moment';
import { Row, Col, Card, Button, Table,Icon,Select,Menu,Dropdown,Popconfirm,Divider,Form,DatePicker,Spin} from 'antd';
import PageHeaderLayout from '../../../../layouts/PageHeaderLayout';
import StandardFormRow from '../../../../components/antd-pro/StandardFormRow';
import TagSelect from '../../../../components/DuokeTagSelect';
import styles from './SupplierList.less'
const Option = Select.Option;
const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const sortOptions = [{
  name:'创建时间降序',
  id:1,
  sorts: {
    created_at: 'desc'
  }
},{
  name:'创建时间升序',
  id:2,
  sorts: {
    created_at: 'asc'
  }
},{
  name:'更新时间降序',
  id:3,
  sorts: {
    updated_at: 'desc'
  }
},{
  name:'更新时间升序',
  id:4,
  sorts: {
    updated_at: 'asc'
  }
},{
  name:'交易笔数降序',
  id:5,
  sorts: {
    trade_count: 'desc'
  }
},{
  name:'交易笔数升序',
  id:6,
  sorts: {
    trade_count: 'asc'
  }
},{
  name:'交易金额降序',
  id:7,
  sorts: {
    trade_amount: 'desc'
  }
},{
  name:'交易金额升序',
  id:8,
  sorts: {
    trade_amount: 'asc'
  }
},{
  name:'他欠我金额降序',
  id:9,
  sorts: {
    balance : 'desc'
  }
},{
  name:'他欠我金额升序',
  id:10,
  sorts: {
    balance : 'asc'
  }
}]
@Form.create()
@connect(state => ({
  supplierList:state.supplierList,
}))
export default class SupplierList extends PureComponent {

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

  handleToSupplierCreate = () => {
    this.props.dispatch(routerRedux.push('/relationship/supplier-create'))
  }

  handleDeleteSingleSupplier = (id) => {
    this.props.dispatch({type:'supplierList/deleteSingle',payload:id}).then(()=>{
      this.handleGetList(this.state.filter,this.state.pages,this.state.sorts)
    })
  }

  handleChangeSupplierStatus = (id,status) => {
    this.props.dispatch({type:'supplierList/changeSupplierStatus',payload:{
      id: id,
      freeze: status
    }}).then(()=>{
       this.handleGetList(this.state.filter,this.state.pages,this.state.sorts)
    })
  }

  handleGetList = ( filter,pages,sorts ) => {
    this.props.dispatch({type:'supplierList/getList',payload:{
      ...filter,
      ...pages,
      sorts,
    }})
  }

  handleSelectSort = (value) => {
    let sorts = sortOptions.find( item => item.name == value.slice(6,value.length)).sorts;
    this.setState({sorts})
    this.handleGetList(this.state.filter,this.state.pages,sorts)
  }

  handleCustomerFormSubmit = () => {
    const { form, dispatch } = this.props;
    setTimeout(() => {
      form.validateFields((err,value) => {
        if(!err) {
          const filter = {
            date_type:'custom',
            sday: value['datePick'][0].format('YYYY-MM-DD'),
            eday: value['datePick'][1].format('YYYY-MM-DD'),
          }
          const pages = {...this.state.pages,page:1}
          this.setState({filter,pages})
          this.handleGetList(filter,pages,this.state.sorts)
        }
      })
    }, 0)
  }

  handleMoreOperation = (item) => {
    return (
      <div>
        <Link to={`/relationship/supplier-detail/${item.id}`}>查看</Link>
        <Divider type='vertical' />
        <Link to={`/relationship/supplier-edit/${item.id}`}>编辑</Link>
        <Divider  type='vertical' />
        <Dropdown overlay={    
          <Menu>
            { item.freeze == 0 ? (
              <Menu.Item key="1"><Popconfirm title="确认冻结此供应商?" onConfirm={this.handleChangeSupplierStatus.bind(null,item.id,1)}>冻结</Popconfirm></Menu.Item>
              ) : (
                <Menu.Item key="2"><Popconfirm title="确认解除冻结此供应商?" onConfirm={this.handleChangeSupplierStatus.bind(null,item.id,0)}>解除冻结</Popconfirm></Menu.Item>
              )}
            <Menu.Item key="3"><Popconfirm title="确认删除此供应商?" onConfirm={this.handleDeleteSingleSupplier.bind(null,item.id)}>删除</Popconfirm></Menu.Item>
          </Menu>
        }>
        <a className="ant-dropdown-link">更多<Icon type="down" /></a>
        </Dropdown>
      </div>
    )
  }

  handleHeaderExtra = () => {
    return (
      <Button type='primary' onClick={this.handleToSupplierCreate}>新建供应商</Button>
    )
  }

  handleTableSortExtra = () => {
    return (
      <Select style={{ width: 200 }}  defaultValue={'排序方式: 创建时间降序'} onChange={this.handleSelectSort} optionLabelProp='value'>
        {
          sortOptions.map( item => {
            return <Option key={item.id} value={`排序方式: ${item.name}`}>{item.name}</Option>
          })
        }
      </Select>
    )
  }

  render() {
    const {supplierList: {supplierList,supplierPagination} , form: {getFieldDecorator}} = this.props;
    const {sorts,pages,filter} = this.state;

    const columns = [{
      title: '姓名',
      dataIndex: 'name',
    }, {
      title: '交易笔数',
      dataIndex: 'trade_count',
    }, {
      title: '交易金额',
      dataIndex: 'trade_amount',
    }, {
      title: '他欠我金额',
      dataIndex: 'balance',
    }, {
      title: '操作',
      dataIndex: 'operation',
      width:'162px', 
      render: (text,record,index) =>( this.handleMoreOperation(record) )
    }];

    const pagination = {
      pageSize:pages.per_page,
      current:pages.page,
      total:supplierPagination.total,
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
        extraContent={this.handleHeaderExtra()}
        className={styles.supplierListExtra}
        >
        <Spin size='large' spinning = {!supplierList.length}>
          <Card bordered={false} className={styles.bottomCardDivided}>
            <Form layout='inline'>
              <FormItem label='选择日期' >
                {getFieldDecorator('datePick',{
                  initialValue:[moment(new Date((new Date).getTime() - 7*24*60*60*1000),'YYYY-MM-DD'),moment(new Date(),'YYYY-MM-DD')]
                })(
                  <RangePicker style={{width:542}} onChange={this.handleCustomerFormSubmit}/>
                )}
              </FormItem>
            </Form>
          </Card>
          <Card bordered={false} title='供应商列表' extra={this.handleTableSortExtra()}>
            <Table 
              rowKey='id'
              columns={columns} 
              dataSource={supplierList} 
              pagination={pagination}
            />
          </Card>
        </Spin>
      </PageHeaderLayout>
    );
  }
}
