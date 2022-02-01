import React from 'react'
import './App.css'
import { Layout } from 'antd'
import { Routes, Route } from 'react-router-dom'
import SearchBook from './components/addbook/Searchbooks'
import Mylibrary from './components/mylibrary/Mylibrary'
import Sidebar from './components/sidebar/Sidebar'
import BookPage from './components/bookpage/BookPage'
import Categories from './components/categories/Categories'
import Statistics from './components/statistics/Statistics'

const { Sider, Content } = Layout

function App() {
  return (
    <Layout>
      <Sider trigger={null} collapsible collapsed={false}>
        <Sidebar />
      </Sider>
      <Content style={{ backgroundColor: '#f5f4f7', height: '100vh' }}>
        <div className="App">
          <Routes>
            <Route path="/addbook" element={<SearchBook />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/book/:booktitle" element={<BookPage />} />
            <Route path="/statistics" element={<Statistics />} />
            <Route path="/" element={<Mylibrary />} />
          </Routes>
        </div>
      </Content>
    </Layout>
  )
}

export default App
