import React from 'react';
import propTypes from 'prop-types';
import styles from './index.less';

class FilterPanel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { label, children, bordered, labelExtra } = this.props;
    return (
      <div
        className={styles.filterPanel}
        style={{ borderBottom: bordered ? '1px dashed #efefef' : 'none' }}>
        <div className={styles.filterPanelLabel}>{labelExtra || `${label}:`}</div>
        <div className={styles.filterPanelWrapper}>{children}</div>
      </div>
    );
  }
}

FilterPanel.propTypes = {
  label: propTypes.string,
  bordered: propTypes.bool,
  labelExtra: propTypes.oneOfType([propTypes.element, propTypes.object]),
};
FilterPanel.defaultProps = {
  label: '筛选',
  bordered: false,
  labelExtra: null,
};

export default FilterPanel;
