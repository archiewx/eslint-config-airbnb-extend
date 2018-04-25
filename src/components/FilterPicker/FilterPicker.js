import React from 'react';
import { Card, DatePicker, Icon, Tag } from 'antd';
import moment from 'moment';
import propTypes from 'prop-types';
import DuokeFilter from '../DuokeFilter/DuokeFilter';
import FilterPanel from '../DuokeFilter/FilterPanel';
import styles from './index.less';

// eslint-disable-next-line
const agoSevenDays = new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000);
/**
 * 使用修饰器方式包装改组件
 * onChange 返回的数据
 * {
 *   ...其他数据,
 *   dates: [Moment, Moment]
 * }
 */
class FilterPicker extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      filters: [],
      search: {},
    };
  }

  // values 是DuokeFilter 所有过滤的数据
  onDuokeFilterChange = (values) => {
    const search = {};
    values.forEach((cv) => {
      if (cv.values.length) {
        search[cv.code] = cv.values.map((option) => option.value);
      }
    });
    // 这里要处理： 不能覆盖时间。要除了时间以外的都覆盖掉
    if (this.state.dates) {
      search.dates = this.state.dates;
    }
    this.setState(
      {
        filters: values,
        search: { ...search },
      },
      () => {
        this.props.onChange(this.state.search);
      },
    );
  };

  onRangePickerChange = (dates) => {
    this.setState(
      (prevState) => ({
        search: { ...prevState.search, dates },
      }),
      () => {
        this.props.onChange(this.state.search);
      },
    );
  };

  setFilterRef = (ref) => {
    this.filterRef = ref;
  };

  // 删除标签回调
  afterClose = (filter) => {
    this.filterRef.clearExactFilter(filter);
  };

  isEmptyFilters = () => {
    return !this.state.filters.filter((filter) => filter.values.length).length;
  };

  renderTags = () => {
    const { filters } = this.state;
    return filters.filter((filter) => filter.values.length).map((filter) => (
      <Tag
        key={filter.name}
        closable
        style={{
          marginTop: 5,
          marginBottom: 5,
        }}
        afterClose={this.afterClose.bind(this, filter)}>
        {filter.name}:{filter.values.map((option) => option.name).join('、')}
      </Tag>
    ));
  };

  render() {
    const {
      filters,
      defaultDate = [moment(agoSevenDays, 'YYYY-MM-DD'), moment(new Date(), 'YYYY-MM-DD')],
    } = this.props;
    return (
      <div className={styles.filterPicker}>
        <Card
          style={{ display: this.isEmptyFilters() ? 'none' : 'block' }}
          bordered={false}
          bodyStyle={{ paddingTop: 10, paddingBottom: 10 }}
          className={styles.bottomCardDivided}>
          <FilterPanel
            label="全部"
            labelExtra={
              <div>
                <a>
                  全部 <Icon type="right" />
                </a>
              </div>
            }>
            {this.renderTags()}
          </FilterPanel>
        </Card>
        <Card
          bordered={false}
          bodyStyle={{ paddingTop: 10, paddingBottom: 10 }}
          className={styles.bottomCardDivided}>
          <DuokeFilter
            filters={filters}
            ref={this.setFilterRef}
            onChange={this.onDuokeFilterChange}
          />
          <FilterPanel label="日期">
            <DatePicker.RangePicker
              defaultValue={defaultDate}
              style={{ width: 542 }}
              onChange={this.onRangePickerChange}
            />
          </FilterPanel>
        </Card>
      </div>
    );
  }
}

FilterPicker.propTypes = {
  onChange: propTypes.func,
  filters: propTypes.array,
};

FilterPicker.defaultProps = {
  onChange: () => {},
  filters: [],
};

export default FilterPicker;
