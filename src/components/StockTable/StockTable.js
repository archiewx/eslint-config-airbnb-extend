import React, { PureComponent } from 'react';
import { connect } from 'dva';
import classNames from 'classnames/bind';
import { Row, Col, InputNumber, Card } from 'antd';
import styles from './StockTable.less';

export default class StockTable extends PureComponent {
  state = {
    skuStocks: {},
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      skuStocks: nextProps.value,
    });
  }

  handleStockInput = (colorId = '', sizeId = '', value) => {
    const { selectColors, selectSizes, selectWarehouseId } = this.props;
    const skuStocks = this.state.skuStocks;
    if (selectColors.length === 0) {
      skuStocks[`${selectWarehouseId}`].store_quantity = value;
    } else if (selectSizes.length === 0) {
      skuStocks[`${selectWarehouseId}_${colorId}`].store_quantity = value;
    } else {
      skuStocks[`${selectWarehouseId}_${colorId}_${sizeId}`].store_quantity = value;
    }
    this.setState({ skuStocks });
    this.props.onChange(skuStocks);
  }

  render() {
    const { selectColors, selectSizes, selectWarehouseId, selecStockUnitNum } = this.props;
    const { skuStocks } = this.state;
    const tableWidth = ((1 / (selectSizes.length + 1)) * 100).toFixed(1);
    return (
      <div>
        {
          selectColors.length === 0 ? (
            <div>
              <Row gutter={64}>
                <Col span={8}>
                  <div><label className={styles.StockLabelTitle}>库存</label></div>
                  <InputNumber value={(skuStocks[`${selectWarehouseId}`] || {}).store_quantity} onChange={this.handleStockInput.bind(null, -1, -1)} placeholder="请输入" precision={0} style={{ width: '100%' }} />
                </Col>
              </Row>
            </div>
          ) : (
            selectSizes.length === 0 ? (
              <div>
                <Row gutter={64}>
                  {
                    selectColors.map((item) => {
                      return (
                        <Col key={item.id} span={8}>
                          <div><label className={styles.StockLabelTitle}>{item.name}</label></div>
                          <InputNumber value={(skuStocks[`${selectWarehouseId}_${item.id}`] || {}).store_quantity} onChange={this.handleStockInput.bind(null, item.id, -1)} placeholder="请输入" precision={0} style={{ width: '100%' }} />
                        </Col>
                      );
                    })
                  }
                </Row>
              </div>
            ) : (
              <div>
                <table className={styles.stockTable} style={{ width: '100%' }}>
                  <thead className={styles.stockTableHead}>
                    <tr>
                      <td style={{ width: `${tableWidth}%` }} />
                      {
                        selectSizes.map((item) => {
                          return <td key={item.id} style={{ width: `${tableWidth}%` }}><span className={styles.spanRowTitlePostion}>{item.name}</span></td>;
                        })
                      }
                    </tr>
                  </thead>
                  <tbody>
                    {
                      selectColors.map((item) => {
                        return (
                          <tr key={item.id}>
                            <td className={styles.stockTableHead}><span className={styles.spanColTitlePostion}>{item.name}</span></td>
                            {
                              selectSizes.map((subItem) => {
                                return <td key={subItem.id}><InputNumber value={(skuStocks[`${selectWarehouseId}_${item.id}_${subItem.id}`] || {}).store_quantity} onChange={this.handleStockInput.bind(null, item.id, subItem.id)} placeholder="请输入" precision={0} style={{ width: '100%', textAlign: 'right' }} className={styles.stockInput} /></td>;
                              })
                            }
                          </tr>
                        );
                      })
                    }
                  </tbody>
                </table>
              </div>
            )
          )
        }
      </div>
    );
  }
}
