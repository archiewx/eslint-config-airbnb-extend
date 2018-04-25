import React from 'react';
import 'rc-trigger/assets/index.css';
import propTypes from 'prop-types';
import { Icon } from 'antd';
import Trigger from 'rc-trigger';
import animates from './animate.css';
import styles from './index.less';

class FilterItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      iconType: 'down',
      show: false,
      offset: [0, 0],
      popupTransitionName: 'rc-trigger-popup-zoom',
    };
    if (this.isPanelListRender()) {
      this.state.popupTransitionName = {
        enter: animates['rc-trigger-popup-swipe-enter'],
        enterActive: animates['rc-trigger-popup-swipe-enter-active'],
        leave: animates['rc-trigger-popup-swipe-leave'],
        leaveActive: animates['rc-trigger-popup-swipe-leave-active'],
        appear: animates['rc-trigger-popup-swipe-appear'],
        appearActive: animates['rc-trigger-popup-swipe-appear-active'],
      };
    }
  }

  onClick = (e) => {
    if (this.props.trigger !== 'click') {
      return e.preventDefault();
    }
    this.toggleIconType(e);
  };

  onPopupVisibleChange = () => {
    this.toggleIconType();
  };

  getPopupClassNameFromAlign = () => {
    const { popupPlacement } = this.props;
    if (this.isPanelListRender()) {
      return styles[`${popupPlacement}RcPopup`];
    }
    return '';
  };

  getPopupContainer = (trigger) => {
    if (this.isPanelListRender()) {
      // 如果是面包渲染的话
      const { parentNode } = trigger;
      this.setState({
        offset: [-trigger.offsetLeft, parentNode.offsetTop],
      });
      return parentNode.parentNode;
    }
    return document.body;
  };
  toggleIconType = (e) => {
    if (this.state.iconType === 'down') {
      this.setState({
        iconType: 'up',
        show: true,
      });
      this.props.onShow(this.props.filter, e);
    } else {
      this.setState({
        iconType: 'down',
        show: false,
      });
      this.props.onHide();
    }
  };

  isPanelListRender = () => {
    return this.props.filter.options.length >= 10;
  };

  preventDefault = (e) => {
    return e.preventDefault();
  };
  render() {
    const { iconType, show } = this.state;
    const { filter } = this.props;
    const builtinPlacements = {
      left: {
        points: ['cr', 'cl'],
      },
      right: {
        points: ['cl', 'cr'],
      },
      top: {
        points: ['bc', 'tc'],
      },
      bottom: {
        points: ['tc', 'bc'],
      },
      topLeft: {
        points: ['bl', 'tl'],
      },
      topRight: {
        points: ['br', 'tr'],
      },
      bottomRight: {
        points: ['tr', 'br'],
      },
      bottomLeft: {
        points: ['tl', 'bl'],
      },
    };
    return (
      <Trigger
        popupPlacement={this.props.popupPlacement}
        builtinPlacements={builtinPlacements}
        action={[this.props.trigger]}
        popupAlign={{
          offset: this.state.offset,
        }}
        getPopupContainer={this.getPopupContainer}
        onPopupVisibleChange={this.onPopupVisibleChange}
        popupTransitionName={this.state.popupTransitionName}
        getPopupClassNameFromAlign={this.getPopupClassNameFromAlign}
        mouseEnterDelay={0.3}
        mouseLeaveDelay={0.3}
        onClick={this.onClick}
        popup={this.props.popup}>
        <div className={styles.filterItem}>
          <a onClick={this.preventDefault}>
            <div
              className={styles.filterItemTitle}
              style={{ backgroundColor: show ? '#F2F2F2' : '#fff' }}>
              {filter.name}
              <Icon style={{ fontSize: 12 }} type={iconType} />
            </div>
          </a>
        </div>
      </Trigger>
    );
  }
}

FilterItem.propTypes = {
  filter: propTypes.shape({
    name: propTypes.string.isRequired,
    options: propTypes.arrayOf(
      propTypes.shape({
        name: propTypes.string.isRequired,
        value: propTypes.oneOfType([propTypes.string, propTypes.number]).isRequired,
      }),
    ),
  }).isRequired,
  trigger: propTypes.oneOf(['hover', 'click']),
  onShow: propTypes.func,
  onHide: propTypes.func,
  popupPlacement: propTypes.oneOf([
    'left',
    'right',
    'top',
    'bottom',
    'topLeft',
    'topRight',
    'bottomLeft',
    'bottomRight',
  ]),
};

FilterItem.defaultProps = {
  trigger: 'click',
  onShow: (filter) => filter,
  onHide: () => {},
  popupPlacement: 'bottomLeft',
};

export default FilterItem;
