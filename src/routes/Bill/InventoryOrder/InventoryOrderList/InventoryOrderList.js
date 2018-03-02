import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { routerRedux,Link } from 'dva/router';
import moment from 'moment';
import currency from 'currency.js'
import { Row, Col, Card, Button, Table,Icon,Select,Menu,Dropdown,Popconfirm,Divider,Form,DatePicker,Spin} from 'antd';
import PageHeaderLayout from '../../../../layouts/PageHeaderLayout';
import StandardFormRow from '../../../../components/antd-pro/StandardFormRow';
import TagSelect from '../../../../components/DuokeTagSelect';
import styles from './InventoryOrderList.less'
const NCNF = value => currency(value, { symbol: "", precision: 2 });
const NCNI = value => currency(value, { symbol: "", precision: 0});
const Option = Select.Option;
const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const breadcrumbList = [{
  title:'单据',
},{
  title:'盘点单'
}]
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
  name:'盘亏数量降序',
  id:3,
  sorts: {
    profit_quantity: 'desc'
  }
},{
  name:'盘亏数量升序',
  id:4,
  sorts: {
    profit_quantity: 'asc'
  }
},{
  name:'盘亏价值降序',
  id:5,
  sorts: {
    profit_amount: 'desc'
  }
},{
  name:'盘亏价值升序',
  id:6,
  sorts: {
    profit_amount: 'asc'
  }
},{
  name:'盘亏价值升序',
  id:7,
  sorts: {
    losses_quantity: 'asc'
  }
},{
  name:'盘亏价值升序',
  id:8,
  sorts: {
    losses_quantity: 'asc'
  }
},{
  name:'盘亏价值升序',
  id:9,
  sorts: {
    losses_amount: 'asc'
  }
},{
  name:'盘亏价值升序',
  id:10,
  sorts: {
    losses_amount: 'asc'
  }
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
@Form.create()
@connect(state => ({
  inventoryOrderList:state.inventoryOrderList,
  layoutFilter:state.layoutFilter
}))
export default class InventoryOrderList extends PureComponent {

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
    this.props.dispatch({type:'inventoryOrderList/getList',payload:{...condition}})
    this.props.dispatch({type:'layoutFilter/getLayoutFilter'})
  }

  handleDeleteSingle = (id) => {
    this.props.dispatch({type:'inventoryOrderList/deleteSingle',payload:id}).then(()=>{
      this.handleGetList(this.state.filter,this.state.pages,this.state.sorts)
    })
  }

  handleGetList = ( filter,pages,sorts ) => {
    this.props.dispatch({type:'inventoryOrderList/getList',payload:{
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

  handleFormSubmit = () => {
    const { form, dispatch } = this.props;
    setTimeout(() => {
      form.validateFields((err,value) => {
        if(!err) {
          this.props.dispatch({type:'inventoryOrderList/setFilterSaleOrderServerData',payload:{
            ...value,
            datePick: value['datePick'] ? [value['datePick'][0].format('YYYY-MM-DD'),value['datePick'][1].format('YYYY-MM-DD')] : undefined
          }})
          const filter = {...this.props.inventoryOrderList.fifterInventoryOrderServerData}
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
        <Link to={`/bill/sale-order/${item.id}`}>查看</Link>
        {/*<Divider type='vertical' />
        <Link to={`/bill/sale-order/${item.id}`}>编辑</Link>*/}
        <Divider  type='vertical' />
        <Dropdown overlay={    
          <Menu>
            <Menu.Item key="1"><Popconfirm title="确认删除此盘点单?" onConfirm={this.handleDeleteSingle.bind(null,item.id)}>删除</Popconfirm></Menu.Item>
          </Menu>
        }>
        <a className="ant-dropdown-link">更多<Icon type="down" /></a>
        </Dropdown>
      </div>
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
    const {inventoryOrderList: {inventoryOrderList,inventoryOrderPagination}, layoutFilter:{inventoryOrderFilter}  , form: {getFieldDecorator}} = this.props;
    const {sorts,pages,filter} = this.state;

    const columns = [{
      title: '单号',
      dataIndex: 'number',
      width:'12%',
      render:(text,record) => `#${record.number}`
    }, {
      title: '盘亏数量',
      dataIndex: 'losses_quantity',
      width:'10%',
      className: styles['numberRightMove'],
      render:(text,record) => NCNI(record.losses_quantity).format(true)
    }, {
      title: '盘亏价值',
      dataIndex: 'losses_amount',
      width:'14%',
      className: styles['numberRightMove'],
      sorter:true,
      render: (text,record) => NCNF(record.losses_amount).format(true)
    }, {
      title: '盘盈数量',
      dataIndex: 'profit_quantity',
      width:'14%',
      className: styles['numberRightMove'],
      sorter:true,
      render: (text,record) => NCNI(record.profit_quantity).format(true)
    }, {
      title:'盘盈价值',
      dataIndex:'profit_amount',
      className: styles['numberRightMove'],
      sorter:true,
      render: (text,record) => NCNF(record.profit_amount).format(true)
    },{
      title:'创建时间',
      dataIndex:'created_at',
      sorter:true,
      width:'20%',
    },{
      title: '操作',
      dataIndex: 'operation',
      width:'172px',
      render: (text,record,index) =>( this.handleMoreOperation(record) )
    }];

    const pagination = {
      pageSize:pages.per_page,
      current:pages.page,
      total:inventoryOrderPagination.total,
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
        breadcrumbList={breadcrumbList}
        >
        <Card bordered={false} className={styles.bottomCardDivided}>
          <Form layout='inline'>
            {
              inventoryOrderFilter.map( (item,index) => {
                return (
                  <StandardFormRow key={`${index}`} title={`${item.name}`} block>
                    <FormItem>
                      {getFieldDecorator(`${item.code}`)(
                        <TagSelect expandable onChange={this.handleFormSubmit}>
                          {
                            item.options.map( (subItem,subIndex) => {
                              return <TagSelect.Option key={`${subIndex}`} value={`${subItem.value}`}>{subItem.name}</TagSelect.Option>
                            })
                          }
                        </TagSelect>
                      )}
                    </FormItem>
                  </StandardFormRow>
                )
              })
            }
            <FormItem label='选择日期' >
              {getFieldDecorator('datePick',{
                initialValue:[moment(new Date((new Date).getTime() - 7*24*60*60*1000),'YYYY-MM-DD'),moment(new Date(),'YYYY-MM-DD')]
              })(
                <RangePicker style={{width:542}} onChange={this.handleFormSubmit}/>
              )}
            </FormItem>
          </Form>
        </Card>
        <Card bordered={false} title='盘点单列表' extra={this.handleTableSortExtra()}>
          <Table 
            rowKey='id'
            columns={columns} 
            dataSource={inventoryOrderList} 
            pagination={pagination}
          />
          <div style={{marginTop:-43,width:300}}>
            <span>{`共 ${inventoryOrderPagination.total || ''} 条销售单 第 ${pages.page} / ${Math.ceil(Number(inventoryOrderPagination.total)/Number(pages.per_page))} 页`}</span>
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}
