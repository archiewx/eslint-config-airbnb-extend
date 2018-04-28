import React from 'react';
import propTypes from 'prop-types';
import styles from './index.less';
import FilterPanel from './FilterPanel';
import FilterItem from './FilterItem';
import FilterPanelList from './FilterPanelList';
import FilterDropList from './FilterDropList';

class DuokeFilter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      filters: [],
      currentFilter: null,
      value: [],
    };
  }

  componentWillReceiveProps(nextProps) {
    if (!this.state.filters.length && this.state.filters !== nextProps.filters) {
      this.setState(
        {
          filters: nextProps.filters,
        },
        () => {
          this.createValues();
        },
      );
    }
  }

  onShow = (filter) => {
    this.setState({
      currentFilter: filter,
    });
  };

  onHide = () => {
    this.setState({
      currentFilter: null,
    });
  };

  // 点击选择项
  onItemClick = (option) => {
    const { value, currentFilter } = this.state;
    const index = value.findIndex((cv) => cv.code === currentFilter.code);
    const { values } = value[index];
    // 判断当前值是否存在
    const optIndex = values.findIndex((cv) => cv.value === option.value);
    if (optIndex !== -1) {
      values.splice(optIndex, 1);
    } else {
      // 这里判断该选项是单选还是多选
      if (this.isRadio(currentFilter)) {
        values.pop();
      }
      values.push(option);
    }
    value[index] = {
      ...value[index],
      values,
    };
    this.setState(
      {
        value,
      },
      () => {
        // state 已经修改
        this.props.onChange(this.state.value);
      },
    );
  };

  getCurrentCheckedValue = () => {
    const currentCheckedValues = this.state.value.find(
      (cv) => cv.code === this.state.currentFilter.code,
    );
    return (currentCheckedValues && currentCheckedValues.values) || [];
  };

  // 是否是单选
  isRadio = (filter) => {
    // 单选的字段数组
    const { radios } = this.props;
    return radios.indexOf(filter.code) !== -1;
  };

  // 初始化默认选择值
  createValues = () => {
    this.setState((prevState) => ({
      value: prevState.filters.map((cv) => ({
        code: cv.code,
        name: cv.name,
        values: cv.values && cv.values.length ? cv.values : [],
      })),
    }));
  };
  clearExactFilter = (filter) => {
    const { value } = this.state;
    const idx = value.findIndex((cv) => cv.code === filter.code);
    value[idx] = {
      ...value[idx],
      values: [],
    };
    this.setState(
      {
        value,
      },
      () => {
        this.props.onChange(this.state.value);
      },
    );
  };
  renderFilterPanel = () => {
    return (
      <FilterPanel bordered>
        {this.state.filters.map(
          (filter) =>
            filter.options && filter.options.length ? (
              <FilterItem
                key={filter.name}
                filter={filter}
                popup={
                  !this.state.currentFilter ? (
                    <div />
                  ) : this.state.currentFilter.options.length < 10 ? (
                    this.renderDropList()
                  ) : (
                    this.renderPanelList()
                  )
                }
                onShow={this.onShow}
                onHide={this.onHide}
              />
            ) : null,
        )}
      </FilterPanel>
    );
  };

  renderDropList = () => {
    return (
      <FilterDropList
        items={this.getCurrentCheckedValue()}
        options={this.state.currentFilter.options}
        onItemClick={this.onItemClick}
      />
    );
  };

  renderPanelList = () => {
    return (
      <FilterPanelList
        items={this.getCurrentCheckedValue()}
        options={this.state.currentFilter.options}
        onItemClick={this.onItemClick}
      />
    );
  };

  render() {
    return (
      <div className={styles.duokeFilter}>
        <div className="duoke-filter__wrapper">{this.renderFilterPanel()}</div>
      </div>
    );
  }
}

DuokeFilter.propTypes = {
  radios: propTypes.arrayOf(propTypes.string),
  onChange: propTypes.func,
  filters: propTypes.array,
};
DuokeFilter.defaultProps = {
  radios: [],
  onChange: () => {},
  filters: [],
};

export default DuokeFilter;
