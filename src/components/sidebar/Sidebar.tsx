import React from 'react'
import { useNavigate } from "react-router-dom";
import { Menu } from 'antd';
import { BookOutlined, PlusOutlined, EditOutlined } from '@ant-design/icons';


function Sidebar() {
  let navigate = useNavigate();

  const handleMenuClick = (event: any) => {
    switch (event.key) {
      case ('mylibrary'):
        navigate('/')
        break
      case ('addbook'):
        navigate('/addbook')
        break
    }

  }

  return (
    <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']} style={{paddingTop: '10vh', height: '100vh'}} onClick={handleMenuClick}>
            <Menu.Item key="mylibrary" icon={<BookOutlined />}>
              My Library
            </Menu.Item>
            <Menu.Item key="addbook" icon={<PlusOutlined />}>
              Add a Book
            </Menu.Item>
            <Menu.Item key="3" icon={<EditOutlined />}>
                Notes
            </Menu.Item>
          </Menu>   
  )
}

export default Sidebar
