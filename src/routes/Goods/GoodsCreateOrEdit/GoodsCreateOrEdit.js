import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Button, Form, Input, InputNumber ,Select ,Menu, Dropdown, Icon , Popconfirm} from 'antd';
import { routerRedux } from 'dva/router';
import classNames from 'classnames/bind'
import FooterToolbar from '../../../components/antd-pro/FooterToolbar';
import PriceTable from '../../../components/PriceTable/PriceTable'
import BarCodeTable from '../../../components/BarCodeTable/BarCodeTable'
import StockTable from '../../../components/StockTable/StockTable'
import SelectMultiple from '../../../components/SelectMultiple/SelectMultiple'
import PictureModal from '../../../components/PictureModal/PictureModal'
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import styles from './GoodsCreateOrEdit.less'
const FormItem = Form.Item;
const Option = Select.Option;
let cx = classNames.bind(styles);
let selectUnits = [] , selectColors = [] ,selectSizes = [];
@Form.create()
@connect(({configSetting,goodsCreateOrEdit,commonData}) => ({
  configSetting,
  goodsCreateOrEdit,
  commonData,
}))
export default class GoodsCreateOrEdit extends PureComponent {

  state = {
    selectWarehouseId:'',
    selecStockUnitNum:'',
    selectQuantityStep:[],
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      selecStockUnitNum: this.state.selecStockUnitNum  ? this.state.selecStockUnitNum : Number(((nextProps.commonData.units).find( n => n.default == '1') || {}).number)  ,
      selectWarehouseId: this.state.selectWarehouseId  ? this.state.selectWarehouseId : (nextProps.commonData.warehouses[0] || {}).id  
    })
  }

  componentDidMount() {
  }

  handleSubmit = (e) => {
    const {validateFields} = this.props.form
    e.preventDefault();
    validateFields((err,value) =>{
      if(!err){
        this.props.dispatch({type:'goodsCreateOrEdit/setServerData',payload:{
          value,
          selectUnits,
          warehouses:this.props.commonData.warehouses,
          itemBarcodeLevel: this.props.configSetting.itemBarcodeLevel,
          itemImageLevel: this.props.configSetting.itemImageLevel
        }})
        this.props.dispatch({type:'goodsCreateOrEdit/createSingleGoods'})
      }
    })
  }

  handleCancel = () => {
    this.props.form.resetFields()
    this.props.dispatch(routerRedux.push('/goods-list'))
  }

  handleCalculateSelect = (arr = [],selectIds = [],type = 'unit') => {
    let arrSelect = [];
    arr.forEach( item => {
      if(selectIds.some( subItem => subItem == item.id)) {
        let current = item;
        arrSelect.push({
          name: type === 'unit' ? `${current.name} ( x ${current.number} )` : `${current.name}`,
          number: type === 'unit' ? `${current.number}` : '',
          id: current.id
        })
      }
    })
    return arrSelect;
  }

  handleSelectQuantityStep = ({item,key,keyPath}) =>  {
    let current = this.state.selectQuantityStep;
    if(current.some( n => n.id === item.props.eventKey)) {
      current.splice(current.findIndex( n => n.id === item.props.eventKey),1)
    }else {
      current.push({
        name: item.props.children,
        id: item.props.eventKey
      })
      let currentQuantityRange = this.props.commonData.priceQuantitySteps.find( n => n.id == item.props.eventKey)
      current = currentQuantityRange.quantityranges.map( item => {
        let name;
        if(item.max == -1) {
          name = `${item.min} ~`
        }else {
          name = `${item.min} ~ ${item.max - 1}`
        }
        return {
          id: item.id,
          name: name
        }
      })
    }
    this.setState({selectQuantityStep:[...current]})
  }

  handlePriceTableValue = (prices = {} ,shops,selectUnits,selectQuantityStep,priceGrades,usePricelelvel,priceModel) =>  {
    let current = {};
    let standardPrice = this.props.form.getFieldValue('standard_price')
    if(usePricelelvel === 'yes') {
      if(priceModel === '') {
        priceGrades.forEach( item => {
          current[`${item.id}`] = {
            pricelevel_id: item.id,
            price: (prices[`${item.id}`] || {}).price || standardPrice || null
          }
        })
      }else if(priceModel === 'shop') {
        shops.forEach( item => {
          priceGrades.forEach( subItem => {
            current[`${item.id}_${subItem.id}`] = {
              shop_id: item.id,
              pricelevel_id: subItem.id,
              price: (prices[`${item.id}_${subItem.id}`] || {}).price || standardPrice  || null
            }
          })
        })
      }else if(priceModel === 'unit') {
        selectUnits.forEach( item => {
          priceGrades.forEach( subItem => {
            current[`${item.id}_${subItem.id}`] = {
              unit_id: item.id,
              pricelevel_id: subItem.id,
              price: (prices[`${item.id}_${subItem.id}`] || {}).price || standardPrice || null
            }
          })
        })
      }else if(priceModel === 'quantityrange') {
        selectQuantityStep.forEach( item => {
          priceGrades.forEach( subItem => {
            current[`${item.id}_${subItem.id}`] = {
              quantityrange_id: item.id,
              pricelevel_id: subItem.id,
              price: (prices[`${item.id}_${subItem.id}`] || {}).price || standardPrice || null
            }
          })
        })
      }
    }else {
      if(priceModel === 'shop') {
        shops.forEach( item => {
          current[`${item.id}`] = {
            shop_id: item.id,
            price: (prices[`${item.id}`] || {}).price || standardPrice || null
          }
        })
      }else if(priceModel === 'unit') {
        selectUnits.forEach( item => {
          current[`${item.id}`] = {
            unit_id: item.id,
            price: (prices[`${item.id}`] || {}).price || standardPrice || null
          }
        })
      }else if(priceModel === 'quantityrange') {
        selectQuantityStep.forEach( item => {
          current[`${item.id}`] = {
            quantityrange_id: item.id,
            price: (prices[`${item.id}`] || {}).price || standardPrice || null
          }
        })
      }
    }
    return current
  }

  handleSkuImages = (selectColors,itemImageLevel) => {
    let current = {};
    if(itemImageLevel === 'item') {
      current = {
        fileList: []
      }
    }else {
      selectColors.forEach( item => {
        current[`${item.id}`] = {
          fileList: []
        }
      })
    }
    return current
  }

  handleSkuStocks = (stocks = {} ,warehouses,selectColors,selectSizes) => {
    let current = {}
    if(selectColors.length === 0) {
      warehouses.forEach( item => {
        current[`${item.id}`] = {
          warehouse_id: item.id,
          store_quantity: (stocks[`${item.id}`] || {}).store_quantity || 0
        }
      })
    }else {
      if(selectSizes.length === 0) {
        warehouses.forEach( item => {
          selectColors.forEach( colorItem => {
            current[`${item.id}_${colorItem.id}`] = {
              warehouse_id: item.id,
              store_quantity: (stocks[`${item.id}_${colorItem.id}`] || {}).store_quantity || 0
            }
          })
        })
      }else {
        warehouses.forEach( item => {
          selectColors.forEach( colorItem => {
            selectSizes.forEach( sizeItem => {
              current[`${item.id}_${colorItem.id}_${sizeItem.id}`] = {
                warehouse_id: item.id,
                store_quantity: (stocks[`${item.id}_${colorItem.id}_${sizeItem.id}`] || {}).store_quantity || 0
              }
            })
          })
        })
      }
    }
    return current
  }

  handleSkuBarcodes = (selectColors,selectSizes,itemBarcodeLevel) => {
    let current = {};
    if(selectColors.length === 0 || itemBarcodeLevel === 0 ) {
      current = {
        barcode: ''
      }
    }else {
      if(selectSizes.length === 0) {
        selectColors.forEach( item => {
          current[`${item.id}`] = {
            barcode: ''
          }
        })
      }else {
        selectColors.forEach( item => {
          selectSizes.forEach( subItem => {
            current[`${item.id}_${subItem.id}`] = {
              barcode: ''
            }
          })
        })
      }
    }
    return current
  }



  handleUnitStockSelect = (value) => {
    this.setState({
      selecStockUnitNum:value.split('').reverse().join('').match(/\d+/)[0].split('').reverse().join('')
    })
  }

  handleStockTabChange = (key) => {
    this.setState({
      selectWarehouseId:key
    })
  }

  render() {
    const {getFieldDecorator,getFieldValue,setFieldsValue} = this.props.form
    const {goodsGroups,colors,sizeLibrarys,units,priceGrades,priceQuantitySteps,shops,warehouses} = this.props.commonData
    const {usePricelelvel,priceModel,itemBarcodeLevel,itemImageLevel} = this.props.configSetting
    const {selectWarehouseId,selecStockUnitNum,selectQuantityStep} = this.state
    const {showData} = this.props.goodsCreateOrEdit

    const formItemLayout = {
      labelCol: {
        span: 1
      },
      wrapperCol: {
        span: 11
      }
    }

    const pictureItemLayout = {
      labelCol: {
        span: 2,
      },
      wrapperCol: {
        offset: 1,
        span: 21
      }
    }

    let defaultSelectUnits =[],defaultStockUnit = {};
    units.forEach( item => {
      if(item.default == '1') {
        defaultSelectUnits.push((item.id).toString());
        // defaultStockUnit = {
        //   name: item.name,
        //   number: item.number
        // }
      }
    })

    selectUnits = this.handleCalculateSelect(units,getFieldValue('unit_select'))
    selectColors = this.handleCalculateSelect(colors,getFieldValue('color_select'),'other')
    selectSizes = this.handleCalculateSelect(sizeLibrarys,getFieldValue('size_select'),'other')
    
    let priceTableValue = this.handlePriceTableValue(showData.prices,shops,selectUnits,selectQuantityStep,priceGrades,usePricelelvel,priceModel) 
    let skuImages = this.handleSkuImages(selectColors,itemImageLevel)
    let skuStocks = this.handleSkuStocks(showData.stocks,warehouses,selectColors,selectSizes)
    let skuBarcodes = this.handleSkuBarcodes(selectColors,selectSizes,itemBarcodeLevel)


    const unitStockSelect = (
      <Select style={{ width: 200 }} defaultValue={`库存单位：件 ( x 1 )`} onChange={this.handleUnitStockSelect} type='combobox' optionLabelProp='value'>
        {
          units.map( item => {
            return (
              <Option key={(item.id).toString()} value={`库存单位：${item.name} ( x ${item.number} )`}>{`${item.name} ( x ${item.number} )`}</Option>
            )
          })
        }
      </Select>
    )

    const quantityStepMenu = (
      <Menu onClick={this.handleSelectQuantityStep}>  
        {
          priceQuantitySteps.map( item => {
            return <Menu.Item key={item.id} >{item.name}</Menu.Item>
          })
        }
      </Menu>
    );

    const stockTabList = warehouses.map( item => {
      return {key:item.id,tab:item.name}
    })

    return (
      <PageHeaderLayout
        title={showData.item_ref ? '编辑商品' : '新建商品'}
      >
        <Card title='属性' bordered={false} className={styles.bottomCardDivided}>
          <Form layout='vertical'>
            <Row gutter={64}>
              <Col span={8}>
                <FormItem label='货号' hasFeedback>
                  {getFieldDecorator('item_ref',{
                    initialValue: showData.item_ref || '',
                    rules: [{required:true,message:'货号不能为空'}],
                  })(
                    <Input placeholder="请输入"/>
                  )}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem label='标准价' hasFeedback>
                  {getFieldDecorator('standard_price',{
                    initialValue: showData.standard_price || '',
                    rules: [{required:true,message:'标准价不能为空'}],
                  })(
                    <InputNumber placeholder="请输入" style={{width:'100%'}} precision={2} min={0}/>
                  )}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem label='进货价'>
                  {getFieldDecorator('purchase_price',{
                    initialValue: showData.purchase_price || '',
                  })(
                    <InputNumber placeholder="请输入" style={{width:'100%'}} precision={2} min={0}/>
                  )}
                </FormItem>
              </Col>
            </Row>
          </Form>
          <Form>
          {
            usePricelelvel === 'yes' ? (
              <div>
                <div style={{paddingBottom:10}}>
                  <label className={styles.priceGradeLabelTitle}>{`价格等级 & 价格组成:`}</label>
                  {
                    priceModel === 'quantityrange' ? (
                      <Dropdown overlay={quantityStepMenu} >
                        <Button className={styles.quantityStepPostion}>
                          选择价格阶梯 <Icon type='down' />
                        </Button>
                      </Dropdown>
                    ) : null
                  }
                </div>
                <div>
                  <FormItem>
                    {getFieldDecorator('prices_table',{
                      initialValue: priceTableValue
                    })(
                      <PriceTable  priceTableValue={priceTableValue} priceGrades={priceGrades} shops={shops} selectUnits={selectUnits} selectQuantityStep={selectQuantityStep} usePricelelvel={usePricelelvel} priceModel={priceModel}/>
                    )}
                  </FormItem>
                </div>
              </div>
            ) : (
              <div>
                <div style={{paddingBottom:10}}>
                  <label className={styles.priceGradeLabelTitle}>{`价格组成 (零售价):`}</label>
                  {
                    priceModel === 'quantityrange' ? (
                      <Dropdown overlay={quantityStepMenu}>
                        <Button className={styles.quantityStepPostion}>
                          选择价格阶梯 <Icon type='down' />
                        </Button>
                      </Dropdown>
                    ) : null
                  }
                </div>
                <FormItem>
                  {getFieldDecorator('prices_table',{
                    initialValue: priceTableValue
                  })(
                    <PriceTable priceTableValue={priceTableValue} priceGrades={priceGrades} shops={shops} selectUnits={selectUnits} selectQuantityStep={selectQuantityStep} usePricelelvel={usePricelelvel} priceModel={priceModel}/>
                  )}
                </FormItem>
              </div>
            )
          }
          </Form>
          <Form layout='horizontal' className={styles.leftLabelTitle}>
            <FormItem label='单位' {...formItemLayout}> 
              {getFieldDecorator('unit_select',{
                initialValue: showData.units ||  defaultSelectUnits
              })(
              <Select mode='multiple' placeholder='请输入单位'>
                {
                  units.map( item => {
                    return (
                      <Option key={item.id} value={(item.id).toString()} disabled={item.default == '1' ? true : false}>{`${item.name} ( x ${item.number} )`}</Option>
                    )
                  })
                }
              </Select>
              )}
            </FormItem>
            <FormItem label='颜色' {...formItemLayout}>
              {getFieldDecorator('color_select',{
                initialValue: showData.colors || []
              })(
              <Select mode='multiple' placeholder='请选择颜色'>
                {
                  colors.map( item => {
                    return (
                      <Option key={item.id} value={(item.id).toString()}>{`${item.name}`}</Option>
                    )
                  })
                }
              </Select>
              )}
            </FormItem>
            <FormItem label='尺码' {...formItemLayout}>
              {getFieldDecorator('size_select',{
                initialValue: showData.sizes ||  []
              })(
              <Select mode='multiple' placeholder={selectColors.length == 0 ? '请先选择颜色' : '请选择尺码'} disabled={selectColors.length ==  0 ? true : false }>
                {
                  sizeLibrarys.map( item => {
                    return (
                      <Option key={item.id} value={(item.id).toString()}>{`${item.name}`}</Option>
                    )
                  })
                }
              </Select>
              )}
            </FormItem>
          </Form>
        </Card>
        <Card title='描述' bordered={false} className={styles.bottomCardDivided}>
          <Form layout='vertical'>
            <Row gutter={64}>
              <Col span={8}>
                <FormItem label='名称'>
                  {getFieldDecorator('name',{
                    initialValue: showData.name || ''
                  })(
                    <Input placeholder='请输入商品名称' />  
                  )}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem label='备注'>
                  {getFieldDecorator('desc',{
                    initialValue: showData.desc || ''
                  })(
                    <Input placeholder='请输入' />  
                  )}
                </FormItem>
              </Col>
            </Row>
            <FormItem>
              {getFieldDecorator('goods_group',{
                initialValue: showData.goodsGroup || []
              })(
                <SelectMultiple  goodsGroups={goodsGroups}/>
              )}
            </FormItem>
          </Form>
        </Card>
        <Card title='图片' bordered={false} className={styles.bottomCardDivided}>
          <Form layout = 'horizontal'>
            <FormItem>
              {getFieldDecorator('picture',{
                initialValue: skuImages
              })(
                <PictureModal selectColors={selectColors} itemImageLevel={itemImageLevel}/>
              )}
            </FormItem>
          </Form>
        </Card>
        <Card title='库存' bordered={false} className={cx({bottomCardDivided:true,cardOuterTab:true})} extra={unitStockSelect}>
          {
            warehouses.length === 0 ? (
              <Form>
                <FormItem>
                  {getFieldDecorator('stock',{
                    initialValue: skuStocks
                  })(
                    <StockTable skuStocks={skuStocks} selectWarehouseId={selectWarehouseId} selecStockUnitNum={selecStockUnitNum} warehouses={warehouses} selectColors={selectColors} selectSizes={selectSizes} />
                  )}
                </FormItem>
              </Form>
            ) : (
              <Card tabList={stockTabList} onTabChange={this.handleStockTabChange} type="inner" bordered={false} className={styles.cardInnerTab} >
                <Form>
                  <FormItem>
                    {getFieldDecorator('stock',{
                      initialValue: skuStocks
                    })(
                      <StockTable skuStocks={skuStocks} selectWarehouseId={selectWarehouseId} selecStockUnitNum={selecStockUnitNum} warehouses={warehouses} selectColors={selectColors} selectSizes={selectSizes} />
                    )}
                  </FormItem>
                </Form>
              </Card>
            )
          }
        </Card>
        {
          itemBarcodeLevel !== -1 ? (
            <Card title='条码' bordered={false}>
              <Form>
                <FormItem>
                  {getFieldDecorator('barcode',{
                    initialValue: showData.barcode || skuBarcodes
                  })(
                     <BarCodeTable skuBarcodes={skuBarcodes} selectColors={selectColors} selectSizes={selectSizes} itemBarcodeLevel={itemBarcodeLevel}/>
                  )}
                </FormItem>
              </Form>
            </Card>
          ) : null
        }
        <FooterToolbar>
          <Popconfirm title={ showData.item_ref ?  '确认放弃编辑商品' : '确认放弃新建商品'} onConfirm={this.handleCancel}><Button>取消</Button></Popconfirm>
          <Button type="primary" onClick={this.handleSubmit}>
            确认
          </Button>
        </FooterToolbar>
      </PageHeaderLayout>
    );
  }
}
