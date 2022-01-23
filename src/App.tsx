import React from 'react'
import './App.css'
import { Layout, Menu } from 'antd'
import SearchBook from './components/addbook/Searchbooks'
import Sidebar from './components/sidebar/Sidebar'

const { Sider, Content } = Layout

function App() {
  return (
    <Layout>
      <Sider trigger={null} collapsible collapsed={false}>
        <Sidebar />
      </Sider>
      <Content style={{backgroundColor: '#f5f4f7', height: '100vh'}}>
        <div className="App">
          <SearchBook />
        </div>
      </Content>
    </Layout>
  )
}

export default App
