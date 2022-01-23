import React from 'react'
import { Menu } from 'antd';
import { BookOutlined, PlusOutlined, EditOutlined } from '@ant-design/icons';

function Sidebar() {
  return (
    <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']} style={{paddingTop: '10vh', height: '100vh'}}>
            <Menu.Item key="1" icon={<BookOutlined />}>
              My Library
            </Menu.Item>
            <Menu.Item key="2" icon={<PlusOutlined />}>
              Add a Book
            </Menu.Item>
            <Menu.Item key="3" icon={<EditOutlined />}>
              See Notes
            </Menu.Item>
          </Menu>   
  )
}

export default Sidebar
