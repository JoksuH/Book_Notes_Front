import React, { useState, useEffect } from 'react'
import { Pagination, Row, Col, Input, Empty, Button, Modal, message } from 'antd'
import BookDataCard from './../bookdatacard/BookDataCard'
import { PlusOutlined } from '@ant-design/icons'

interface categoryData {
  _id: string
  name: string
  books: bookData
}

interface bookData {
  title: String
  description: String
  categories: string[]
  imageLinks?: imagelinks | undefined
  imageurl?: string
  authors?: String[]
  author?: String
  industryIdentifiers: isbnData[]
}

interface isbnData {
  identifier: String
}

interface imagelinks {
  thumbnail: string
}

const inputRowStyle = { width: '50vw', height: '10vh', margin: 'auto', marginTop: '1vh', paddingTop: '20px' }

const Categories: React.FC = () => {
  const [Categories, SetCategories] = useState<categoryData[] | undefined>(undefined)
  const [CurrentCategoryData, SetCurrentCategoryData] = useState<categoryData[] | undefined>(undefined)
  const [Filter, SetFilter] = useState<string | undefined>(undefined)
  const [ResultsAmount, SetResoultsAmount] = useState<number | undefined>(undefined)
  const [ModalVisible, SetModalVisible] = useState<boolean>(false)
  const [TypedCategoryName, SetTypedCategoryName] = useState<string | undefined>(undefined)

  useEffect(() => {
    fetch(`http://localhost:4000/categories/`).then((response) => {
      response.json().then((json) => {
        if (json) {
          SetCategories(json)
          SetResoultsAmount(json.length)
          SetCurrentCategoryData(json.slice(0, 5))
        } else message.warn('No Categories Found!')
      })
    })
  }, [])

  const handleaddCategoryClick = () => {
    SetModalVisible(true)
  }

  const handleCategorySave = () => {
    if (TypedCategoryName) {
      fetch('http://localhost:4000/categories/', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          category: TypedCategoryName,
        }),
      }).then(() => message.info('Category added to database'))
    }
    SetTypedCategoryName(undefined)
    SetModalVisible(false)
  }

  const handleModalCancel = () => {
    SetModalVisible(false)
    SetTypedCategoryName(undefined)
  }

  const handleCategoryNameTyping = (event: React.ChangeEvent<HTMLInputElement>) => {
    SetTypedCategoryName(event.target.value)
  }

  const handlePageChange = (page: number) => {
    if (Categories) {
      if (Filter) {
        let filteredCategories: categoryData[] = Categories.filter((book) => book.name.toLowerCase().includes(Filter.toLowerCase()))
        SetResoultsAmount(filteredCategories.length)
        SetCurrentCategoryData(filteredCategories.slice((page - 1) * 5, page * 5))
        filteredCategories.length > 0 ? SetCurrentCategoryData(filteredCategories.slice(0, 5)) : SetCurrentCategoryData(undefined)
      } else {
        SetCurrentCategoryData(Categories.slice((page - 1) * 5, page * 5))
        SetResoultsAmount(Categories.length)
      }
    }
  }
  const handleFilterTyping = (event: React.ChangeEvent<HTMLInputElement>) => {
    const text: string = event.target.value
    SetFilter(text)
    if (Categories) {
      let filteredCategories: categoryData[] = Categories.filter((book) => book.name.toLowerCase().includes(text.toLowerCase()))
      SetResoultsAmount(filteredCategories.length)
      filteredCategories.length > 0 ? SetCurrentCategoryData(filteredCategories.slice(0, 5)) : SetCurrentCategoryData(undefined)
    }
  }

  return (
    <div style={inputRowStyle}>
      <Row>
        <Col span={16}>
          <Input placeholder="Filter Books" onChange={handleFilterTyping}></Input>
        </Col>
        <Col span={8}>
          <Button icon={<PlusOutlined />} onClick={handleaddCategoryClick}>
            Add a Category
          </Button>
        </Col>
      </Row>
      <Modal title="Create a category" visible={ModalVisible} onOk={handleCategorySave} onCancel={handleModalCancel}>
        <Input size="large" placeholder="Name..." onChange={handleCategoryNameTyping} />
      </Modal>
      {CurrentCategoryData ? (
        <>
          {CurrentCategoryData.map((category: categoryData, index: number) => {
            return (
              <div key={category._id}>
                <p>{category.name}</p>
              </div>
            )
          })}
          <Pagination defaultCurrent={1} defaultPageSize={5} total={ResultsAmount} onChange={handlePageChange} showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`} style={{ marginTop: '2vh' }} hideOnSinglePage={true} />
        </>
      ) : (
        <Empty style={{ marginTop: '15vh' }} description={<span>No Books Found!</span>} />
      )}
    </div>
  )
}

export default Categories
