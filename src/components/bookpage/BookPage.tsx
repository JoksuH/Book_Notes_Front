import React, { useState, useEffect } from 'react'
import { Button, Row, Col, Image, Typography, Layout, Rate, Space, Input, Modal, message, Checkbox } from 'antd'
import { motion } from 'framer-motion'
import { useParams, useNavigate } from 'react-router-dom'
import { PlusOutlined } from '@ant-design/icons'

const textStyle = { marginBottom: '1vh' }
const layoutStyle = { width: '50vw', margin: 'auto', marginTop: '1vh', border: '1px solid black', borderRadius: '10px', padding: '20px', backgroundColor: 'white' }
const listItem = {
  hidden: { opacity: 0, x: -50 },
  show: (index: number) => ({ opacity: 1, x: 0, transition: { duration: 0.3, delay: index * 0.1 } }),
}

interface bookData {
  _id: string
  title: string
  description: string
  categories: string[]
  imageurl?: string
  author: string
  industryIdentifiers: isbnData[]
  dateRead: string
  highlightnotes: string[]
  review?: string
  notes: string[]
}

interface categoryData {
  _id: string
  name: string
  books: bookData
}

interface isbnData {
  identifier: String
}

const { Title, Text } = Typography
const { Sider, Content } = Layout
const { TextArea } = Input

const BookPage: React.FC = () => {
  // Load the data that can be modified into state values
  const [BookData, SetBookData] = useState<bookData | undefined>(undefined)
  const [Rating, SetRating] = useState<number | undefined>(undefined)
  const [HighlightedNotes, SetHighlightedNotes] = useState<string[] | undefined>(undefined)
  const [Review, SetReview] = useState<String | undefined>(undefined)
  const [Notes, SetNotes] = useState<string[] | undefined>(undefined)
  const [AllCategories, SetAllCategories] = useState<categoryData[] | undefined>(undefined)
  const [SelectedCategories, SetSelectedCategories] = useState<string[]>([])
  const [ModalVisible, SetModalVisible] = useState<boolean>(false)

  const { booktitle } = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    fetch(`http://localhost:4000/books/${booktitle}`).then((response) => {
      response.json().then((json) => {
        if (json[0]) {
          SetBookData(json[0])
          SetRating(json[0].rating)
          SetSelectedCategories(json[0].categories)
          SetHighlightedNotes(json[0].highlightnotes)
          SetReview(json[0].review)
          SetNotes(json[0].notes)
        } else alert('No Books Found With The Current ISBN')
      })
    })
  }, [booktitle])

  const handleBackClick = () => {
    navigate('/')
  }

  const handleModalCancel = () => {
    SetModalVisible(false)
    //SetTypedCategoryName(undefined)
  }

  const handleCategoryNameTyping = (event: React.ChangeEvent<HTMLInputElement>) => {
    //SetTypedCategoryName(event.target.value)
  }

  const handleCategorySave = () => {
    
    if (BookData) {
      fetch('http://localhost:4000/categories/', {
        method: 'PUT',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          categories: SelectedCategories,
          booktitle: BookData.title
        }),
      }).then(() => {fetch(`http://localhost:4000/books/catories/${BookData._id}/`, {
        method: 'PUT',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          categories: SelectedCategories,
        }),
      }).then(() => message.info('Categories added to database'))})
    
    SetModalVisible(false)
    
  }
}

  const handleCheckboxCheck = (checkedValue: any) => {
    SetSelectedCategories(checkedValue)
  }

  const handleaddCategoryClick = () => {
    if (AllCategories === undefined) {
    fetch(`http://localhost:4000/categories/`).then((response) => {
      response.json().then((json) => {
        if (json) {
          SetAllCategories(json)
          SetModalVisible(true)
        } else message.warn('No Categories Found!')
      })
    })
  }
  else SetModalVisible(true)
  }

  const handleReviewType = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    SetReview(event.target.textContent as string)
  }
  const onNoteAdd = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const element = event.target as HTMLTextAreaElement
    if (Notes) {
      let copyArr: string[] = [...Notes]
      copyArr.push(element.textContent as string)
      SetNotes(copyArr)
    }
  }

  const handleSaveClick = () => {}
  

  return (
    <motion.div initial="hidden" animate="show" variants={listItem}>
      {BookData && (
        <>
          {' '}
          <Space direction="vertical">
            <Layout style={layoutStyle}>
              {BookData.imageurl && (
                <Sider style={{ backgroundColor: 'white', padding: '10px' }}>
                  <Image height="15vh" src={BookData.imageurl} preview={false} />
                </Sider>
              )}
              <Content>
                <Row justify="center" style={textStyle} gutter={32}>
                  <Col span={12}>
                    Title: <Title>{BookData.title}</Title>
                  </Col>
                  {BookData.author && (
                    <Col span={12}>
                      Author:<Title>{BookData.author}</Title>
                    </Col>
                  )}
                </Row>
                <Row justify="center" style={textStyle} gutter={12}>
                  <Col span={24}>
                    <Text italic>{BookData.description}</Text>
                  </Col>
                </Row>
                <Row justify="center" style={textStyle} gutter={12}>
                  <Col span={16}>
                    <Text>
                      Categories:{' '}
                      {SelectedCategories.map((category: string, index: number) => {
                        return index < SelectedCategories.length - 1 ? category + ', ' : category
                      })}
                    </Text>
                  </Col>
                  <Col span={8}>
                    <Button icon={<PlusOutlined />} onClick={handleaddCategoryClick}>
                      Add a Category
                    </Button>
                  </Col>
                  <Modal title="Select More Categories" visible={ModalVisible} onOk={handleCategorySave} onCancel={handleModalCancel}>
                    <Input size="large" placeholder="Name..." onChange={handleCategoryNameTyping} />
                    <Checkbox.Group style={{ width: '100%', padding: '25px' }} onChange={handleCheckboxCheck} defaultValue={SelectedCategories}>
                      <Row>
                        {AllCategories && AllCategories.map(category => {
                          return(
                        <Col span={8} key={category._id} style={{marginBottom: '25px'}}>
                        <Checkbox value={category.name}>{category.name}</Checkbox>
                       </Col>
                       )
                        })}
                      </Row>
                    </Checkbox.Group>
                  </Modal>
                </Row>
                <Row justify="center" style={textStyle} gutter={12}>
                  <Col span={24}>
                    <Text italic>Book Read: {BookData.dateRead.split('T')[0]}</Text>
                  </Col>
                </Row>

                <Row justify="center">
                  <Col span={24}>
                    <Text strong>Rate it: </Text>
                  </Col>
                </Row>
                <Row justify="center" style={textStyle} gutter={32}>
                  <Col span={24}>
                    <Rate allowHalf defaultValue={2.5} />
                  </Col>
                </Row>
              </Content>
            </Layout>

            <Row justify="center" style={layoutStyle} gutter={32}>
              <Col span={24}>
                <Title>Highlighted Notes</Title>
              </Col>
              <Col span={12} style={{ border: '1px solid black', padding: '5px', borderRadius: '5px' }}>
                <Space direction="vertical">
                  {BookData.highlightnotes.length !== 0 ? (
                    <>
                      <Text>This is a note written for the book</Text>
                      <Text>This is a note written for the book</Text>
                      <Text>This is a note written for the book</Text>
                      <Text>This is a note written for the book</Text>
                      <Text>This is a note written for the book</Text>
                    </>
                  ) : (
                    <Text>No notes found. Upload notes to add them</Text>
                  )}
                </Space>
              </Col>
              <Col span={12}>
                <Button>Upload Highlighted Notes</Button>
              </Col>
            </Row>
            <Row justify="center" style={layoutStyle} gutter={32}>
              <Col span={24}>
                <Space direction="vertical">
                  <Title>My Review</Title>
                  {BookData.review ? (
                    <>
                      <Text>This is the review written for the book</Text>
                      <Text>This is the review written for the book</Text>
                      <Text>This is the review written for the book</Text>
                      <Text>This is the review written for the book</Text>
                      <Text>This is the review written for the book</Text>
                    </>
                  ) : (
                    <TextArea autoSize={{ minRows: 3, maxRows: 8 }} style={{ width: '700px' }} onChange={handleReviewType} placeholder="Add a review..." />
                  )}
                </Space>
              </Col>
            </Row>
            <Row justify="center" style={layoutStyle} gutter={32}>
              <Col span={24}>
                <Space direction="vertical">
                  <Title>Notes</Title>
                  {Notes && Notes.length !== 0 && (
                    <>
                      {Notes.map((note) => {
                        return <Text>{note}</Text>
                      })}
                    </>
                  )}

                  <TextArea autoSize={{ minRows: 1, maxRows: 8 }} style={{ width: '700px' }} onPressEnter={onNoteAdd} placeholder="Add a note..." />
                </Space>
              </Col>

              <Row justify="center" style={{ marginTop: '25px' }} gutter={64}>
                <Col span={12}>
                  <Button>Save</Button>
                </Col>
                <Col span={12}>
                  <Button onClick={handleBackClick}>Go Back</Button>
                </Col>
              </Row>
            </Row>
          </Space>
        </>
      )}
    </motion.div>
  )
}

BookPage.defaultProps = {
  small: false,
  rateable: false,
}

export default BookPage
