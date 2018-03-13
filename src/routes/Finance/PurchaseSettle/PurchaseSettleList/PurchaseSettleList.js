import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { routerRedux,Link } from 'dva/router';
import moment from 'moment';
import currency from 'currency.js'
import { Row, Col, Card, Button, Table,Icon,Select,Menu,Dropdown,Popconfirm,Divider,Form,DatePicker,Spin} from 'antd';
import PageHeaderLayout from '../../../../layouts/PageHeaderLayout';
import StandardFormRow from '../../../../components/antd-pro/StandardFormRow';
import TagSelect from '../../../../components/DuokeTagSelect';
import styles from './PurchaseSettleList.less'
const NCNF = value => currency(value, { symbol: "", precision: 2 });
const NCNI = value => currency(value, { symbol: "", precision: 0});
const Option = Select.Option;
const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const breadcrumbList = [{
  title:'财务',
},{
  title:'销售结算'
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
  name:'单据数量降序',
  id:3,
  sorts: {
    order_quantity: 'desc'
  }
},{
  name:'单据数量升序',
  id:4,
  sorts: {
    order_quantity: 'asc'
  }
},{
  name:'总额降序',
  id:4,
  sorts: {
    value: 'asc'
  }
},{
  name:'总额升序',
  id:4,
  sorts: {
    value: 'asc'
  }
}]
const condition = {
  mode:'purchaseorders',
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
  purchaseSettleList:state.purchaseSettleList,
  layoutFilter:state.layoutFilter
}))
export default class PurchaseSettleList extends PureComponent {

  state = {
    mode:'purchaseorders',
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
    this.props.dispatch({type:'purchaseSettleList/getList',payload:{...condition}})
    this.props.dispatch({type:'layoutFilter/getLayoutFilter'})
  }

  handleDeleteSingle = (id) => {
    console.log(id)
    // this.props.dispatch({type:'purchaseSettleList/deleteSingle',payload:id}).then(()=>{
    //   this.handleGetList(this.state.filter,this.state.pages,this.state.sorts)
    // })
  }

  handleGetList = ( filter,pages,sorts,mode ) => {
    this.props.dispatch({type:'purchaseSettleList/getList',payload:{
      ...filter,
      ...pages,
      sorts,
      mode
    }})
  }

  handleSelectSort = (value) => {
    let sorts = sortOptions.find( item => item.name == value.slice(6,value.length)).sorts;
    this.setState({sorts})
    this.handleGetList(this.state.filter,this.state.pages,sorts,this.state.mode)
  }

  handlepurchaseSettleFormSubmit = () => {
    const { form, dispatch } = this.props;
    setTimeout(() => {
      form.validateFields((err,value) => {
        if(!err) {
          this.props.dispatch({type:'purchaseSettleList/setFilterPurchaseSettleServerData',payload:{
            ...value,
            datePick: value['datePick'] ? [value['datePick'][0].format('YYYY-MM-DD'),value['datePick'][1].format('YYYY-MM-DD')] : undefined
          }})
          const filter = {...this.props.purchaseSettleList.fifterPurchaseSettleServerData}
          const pages = {...this.state.pages,page:1}
          this.setState({filter,pages})
          this.handleGetList(filter,pages,this.state.sorts,this.state.mode)
        }
      })
    }, 0)
  }

  handleMoreOperation = (item) => {
    return (
      <div>
        <Link to={`/finance/purchase-settle-detail/${item.id}`}>查看</Link>
        <Divider  type='vertical' />
        <Dropdown overlay={    
          <Menu>
              <Menu.Item key="1"><Popconfirm title="确认删除此结算单?" onConfirm={this.handleDeleteSingle.bind(null,item.id)}>删除</Popconfirm></Menu.Item>
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
    const {purchaseSettleList: {purchaseSettleList,purchaseSettlePagination}  , layoutFilter: {purchaseSettleFilter}, form: {getFieldDecorator}} = this.props;
    const {mode,sorts,pages,filter} = this.state;

    const columns = [{
      title: '流水',
      dataIndex: 'name',
      render: (text,record) => `#${record.number}`
    }, {
      title: '交易供应商',
      dataIndex: 'payer',
      width:'20%',
      render: (text,record) => `${record.ownerable.data.name}`
    }, {
      title: '单据数量',
      dataIndex: 'order_quantity',
      width:'15%',
      sorter:true,
      className: styles['numberRightMove'],
      render: (text,record) => NCNI(record.order_quantity).format(true)
    }, {
      title: '总额',
      dataIndex: 'value',
      sorter:true,
      className: styles['numberRightMove'],
      render: (text,record) => NCNF(record.value).format(true)
    }, {
      title: '创建时间',
      width:'20%',
      sorter:true,
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
      total:purchaseSettlePagination.total,
      showQuickJumper:true,
      showSizeChanger:true,
      onChange:( page,pageSize ) => {
        const pages = {
          per_page:pageSize,
          page:page
        }
        this.setState({pages})
        this.handleGetList(filter,pages,sorts,mode)
      },
      onShowSizeChange: ( current,size) => {
        const pages = {
          per_page:size,
          page:1
        }
        this.setState({pages})
        this.handleGetList(filter,pages,sorts,mode)
      }
    }

    return (
      <PageHeaderLayout
        breadcrumbList={breadcrumbList}
        >
        <Card bordered={false} className={styles.bottomCardDivided}>
          <Form layout='inline'>
            {
              purchaseSettleFilter.map( (item,index) => {
                return (
                  <StandardFormRow key={`${index}`} title={`${item.name}`} block>
                    <FormItem>
                      {getFieldDecorator(`${item.code}`)(
                        <TagSelect expandable onChange={this.handlepurchaseSettleFormSubmit}>
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
                <RangePicker style={{width:542}} onChange={this.handlepurchaseSettleFormSubmit}/>
              )}
            </FormItem>
          </Form>
        </Card>
        <Card bordered={false} title='进货结算列表' extra={this.handleTableSortExtra()}>
          <Table 
            rowKey='id'
            columns={columns} 
            dataSource={purchaseSettleList} 
            pagination={pagination}
          />
          <div style={{marginTop:-43,width:300}}>
            <span>{`共 ${purchaseSettlePagination.total || ''} 条结算 第 ${pages.page} / ${Math.ceil(Number(purchaseSettlePagination.total)/Number(pages.per_page))} 页`}</span>
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}
