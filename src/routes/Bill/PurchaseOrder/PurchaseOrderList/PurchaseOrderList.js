import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { routerRedux,Link } from 'dva/router';
import moment from 'moment';
import currency from 'currency.js'
import { Row, Col, Card, Button, Table,Icon,Select,Menu,Dropdown,Popconfirm,Divider,Form,DatePicker,Spin} from 'antd';
import PageHeaderLayout from '../../../../layouts/PageHeaderLayout';
import StandardFormRow from '../../../../components/antd-pro/StandardFormRow';
import TagSelect from '../../../../components/DuokeTagSelect';
import styles from './PurchaseOrderList.less'
const NCNF = value => currency(value, { symbol: "", precision: 2 });
const NCNI = value => currency(value, { symbol: "", precision: 0});
const Option = Select.Option;
const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const breadcrumbList = [{
  title:'单据',
},{
  title:'进货单'
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
  name:'商品数量降序',
  id:3,
  sorts: {
    total_quantity: 'desc'
  }
},{
  name:'商品数量升序',
  id:4,
  sorts: {
    total_quantity: 'asc'
  }
},{
  name:'总额降序',
  id:5,
  sorts: {
    due_fee: 'desc'
  }
},{
  name:'总额升序',
  id:6,
  sorts: {
    due_fee: 'asc'
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
  purchaseOrderList:state.purchaseOrderList,
  layoutFilter:state.layoutFilter
}))
export default class PurchaseOrderList extends PureComponent {

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
    this.props.dispatch({type:'purchaseOrderList/getList',payload:{...condition}})
    this.props.dispatch({type:'layoutFilter/getLayoutFilter'})
  }

  handleDeleteSingle = (id) => {
    this.props.dispatch({type:'purchaseOrderList/deleteSingle',payload:id}).then(()=>{
      this.handleGetList(this.state.filter,this.state.pages,this.state.sorts)
    })
  }

  handleGetList = ( filter,pages,sorts ) => {
    this.props.dispatch({type:'purchaseOrderList/getList',payload:{
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

  handlSortTable = (pagination, filters, sorter) => {
    if(sorter.order) {
      let sorts = {
        [`${sorter.field}`] : sorter.order.slice(0,sorter.order.length-3)
      }
      this.setState({sorts})
      this.handleGetList(this.state.filter,this.state.pages,sorts)
    }else {
      const sorts = {
        created_at: 'desc'
      };
      this.setState({sorts})
      this.handleGetList(this.state.filter,this.state.pages,sorts)
    }
  }

  handleFormSubmit = () => {
    const { form, dispatch } = this.props;
    setTimeout(() => {
      form.validateFields((err,value) => {
        if(!err) {
          this.props.dispatch({type:'purchaseOrderList/setFilterSaleOrderServerData',payload:{
            ...value,
            datePick: value['datePick'] ? [value['datePick'][0].format('YYYY-MM-DD'),value['datePick'][1].format('YYYY-MM-DD')] : undefined
          }})
          const filter = {...this.props.purchaseOrderList.fifterPurchaseOrderServerData}
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
        <Link to={`/bill/purchase-detail/${item.id}`}>查看</Link>
        {/*<Divider type='vertical' />
        <Link to={`/bill/sale-order/${item.id}`}>编辑</Link>*/}
        <Divider  type='vertical' />
        <Dropdown overlay={    
          <Menu>
            <Menu.Item key="1"><Popconfirm title="确认删除此进货单?" onConfirm={this.handleDeleteSingle.bind(null,item.id)}>删除</Popconfirm></Menu.Item>
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
    const {purchaseOrderList: {purchaseOrderList,purchaseOrderPagination}, layoutFilter:{purchaseOrderFilter}  , form: {getFieldDecorator}} = this.props;
    const {sorts,pages,filter} = this.state;

    const columns = [{
      title: '单号',
      dataIndex: 'number',
      width:'15%',
      render:(text,record) => `#${record.number}`
    }, {
      title: '交易供应商',
      dataIndex: 'sale_customer',
      width:'15%',
      render:(text,record) => `${record.supplier.data.name}`
    }, {
      title: '商品数量',
      dataIndex: 'total_quantity',
      width:'15%',
      className: styles['numberRightMove'],
      sorter:true,
      render: (text,record) => NCNI(record.total_quantity).format(true)
    }, {
      title: '总额',
      dataIndex: 'due_fee',
      className: styles['numberRightMove'],
      sorter:true,
      render: (text,record) => NCNF(record.due_fee).format(true)
    }, {
      title:'创建时间',
      dataIndex:'created_at',
      width:'20%',
      sorter:true
    },{
      title: '操作',
      dataIndex: 'operation',
      width:'172px',
      render: (text,record,index) =>( this.handleMoreOperation(record) )
    }];

    const pagination = {
      pageSize:pages.per_page,
      current:pages.page,
      total:purchaseOrderPagination.total,
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
              purchaseOrderFilter.map( (item,index) => {
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
        <Card bordered={false} title='进货单列表' extra={this.handleTableSortExtra()}>
          <Table 
            rowKey='id'
            columns={columns} 
            dataSource={purchaseOrderList} 
            pagination={pagination}
            onChange={this.handlSortTable}
          />
          <div style={{marginTop:-43,width:300}}>
            <span>{`共 ${pagination.total || ''} 条进货单 第 ${pages.page} / ${Math.ceil(Number(pagination.total)/Number(pages.per_page))} 页`}</span>
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}
