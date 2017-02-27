'use strict';

import React from 'react';
import './index.scss';
import {Navigation,Icon,Menu} from 'qnui';
const {Item, Group} = Navigation

let onMouseEnter = (id, item, nav) => {
    console.log('onMouseEnter')  
}

let onMouseLeave = (id, item, nav) => {
    console.log('onMouseLeave')
}

class Header extends React.Component {
  render() {
    return (
       <Navigation
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        type="filling"
        activeDirection="bottom"
        >
        <li className="navigation-logo-zone">
          <Icon type="email" />
          <span>聚星台</span>
        </li>
        <Item
            itemid="1"
            text="Value Added Service"
            icon="service"
            >
                <Menu>
                    <Menu.Item key="1">Option 1</Menu.Item>
                    <Menu.Item disabled key="2">Option 2</Menu.Item>
                    <Menu.Item key="3">Option 3</Menu.Item>
                    <Menu.Item key="4">Option 4</Menu.Item>
                    <Menu.PopupItem label="Option 4" key="5">
                      <Menu>
                        <Menu.Item key="11">Option 1</Menu.Item>
                      </Menu>
                    </Menu.PopupItem>
                </Menu>
            </Item>
            <Item
                itemid="2"
                text="Training"
                icon="training"
                >
            </Item>
        <li className="navigation-toolbar">
          <ul>
            <li>
              <Icon type="atm" />
              <span>帮助</span>
            </li>
            <li>
              <Icon type="set" />
              <span>设置</span>
            </li>
          </ul>
        </li>
    </Navigation>
    );
  }
}
export default Header;
