import React, { useState, useEffect } from 'react'
import { Button, Row, Col, Image, Typography, Layout, Rate, Space, Input, Modal, message, Checkbox, DatePicker } from 'antd'
import { motion } from 'framer-motion'
import { useParams, useNavigate } from 'react-router-dom'
import { PlusOutlined, CalendarOutlined } from '@ant-design/icons'
import moment, { Moment } from "moment"

const textStyle = { marginBottom: '1vh', marginTop: '2vh' }
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
  const [ReadDate, SetReadDate] = useState<Date | undefined>(undefined)
  const [HighlightedNotes, SetHighlightedNotes] = useState<string[]>([])
  const [Review, SetReview] = useState<String | undefined>(undefined)
  const [Notes, SetNotes] = useState<string[] | undefined>(undefined)
  const [AllCategories, SetAllCategories] = useState<categoryData[] | undefined>(undefined)
  const [OriginalCategories, SetOriginalCategories] = useState<string[]>([])
  const [SelectedCategories, SetSelectedCategories] = useState<string[]>([])
  const [CategoryModalVisible, SetCategoryModalVisible] = useState<boolean>(false)
  const [NoteAddModalVisible, SetNoteAddModalVisible] = useState<boolean>(false)
  const [DateSelectVisible, SetDateSelectVisible] = useState<boolean>(false)


  const { booktitle } = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    fetch(`http://localhost:4000/books/${booktitle}`).then((response) => {
      response.json().then((json) => {
        if (json[0]) {
          SetBookData(json[0])
          SetRating(json[0].rating)
          SetSelectedCategories(json[0].categories)
          SetOriginalCategories(json[0].categories)
          SetHighlightedNotes(json[0].highlightnotes)
          SetReview(json[0].review)
          SetNotes(json[0].notes)
          SetReadDate(json[0].dateRead)
        } else alert('No Books Found With The Current ISBN')
      })
    })
  }, [booktitle])

  const handleBackClick = () => {
    navigate('/')
  }

  const handleRatingChange = (value: number) => {
      SetRating(value)
    }
  

  const handleModalCancel = () => {
    SetCategoryModalVisible(false)
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
          originalcategories: OriginalCategories,
          booktitle: BookData.title
        }),
      }).then(() => {
      fetch(`http://localhost:4000/books/${BookData._id}/`, {
        method: 'PUT',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          categories: SelectedCategories,
        }),
      }).then(() => message.info('Categories added to database'))})
    
    SetCategoryModalVisible(false)
    
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
          SetCategoryModalVisible(true)
        } else message.warn('No Categories Found!')
      })
    })
  }
  else SetCategoryModalVisible(true)
  }

  const handleHighNotesTyping = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    console.log(event.target.value)
  }

  const handleHighNotesPaste = (event: React.ClipboardEvent<HTMLTextAreaElement>) => {
    let tobeSavedNotes: string[] = [...HighlightedNotes]
    // '==========' is the formatting used by kindle note import to seperate comments
    let splitNotes:string[] = event.clipboardData.getData('text').split('==========')
    splitNotes.forEach(note => {
        let noteValues = note.split('\n')
        let bookInfo: string
        //If the first line is empty, commonly the other lines other than the first pasted line, then get the book info from the second line
        noteValues[0] === '' ? bookInfo = noteValues[1] : bookInfo = noteValues[0] 
        //In this split the second to last part is the note
        checkBookInfoMatch(bookInfo) && tobeSavedNotes.push(noteValues[noteValues.length-2])
    })

    SetHighlightedNotes(tobeSavedNotes)
  }

  const checkBookInfoMatch = (info: string): boolean => {

    if (info && info.length > 2) {
    let authorInfo: string = info.split('(')[1].slice(0,-1)
    let bookTitleInfo: string = info.split(' ')[0]
    console.log(bookTitleInfo)
    //Info check looks at whether the author and the first word in the title are the same
    if (BookData) return(authorInfo.toLowerCase() === BookData.author.toLowerCase() && bookTitleInfo.toLowerCase() === BookData.title.split(' ')[0].toLowerCase())
  }
    return false
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

  const handleDateChange = () => {
    SetDateSelectVisible(!DateSelectVisible)
  }

  const handleDateSelection = (date: Moment | null) => {
    SetReadDate(date?.toDate())
  }


  const handleSaveClick = () => {
    if (BookData) {
    fetch(`http://localhost:4000/books/${BookData._id}/`, {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      //Send data that could be modified
      body: JSON.stringify({
        categories: SelectedCategories,
        rating: Rating,
        highlightednotes: HighlightedNotes,
        review: Review,
        notes: Notes,
        dateRead: ReadDate
      }),
    }).then(() => message.info('Changes saved to database'))
  }
  }
  

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
                    <Title level={4}>
                      Categories:{' '}
                      {SelectedCategories.map((category: string, index: number) => {
                        return index < SelectedCategories.length - 1 ? category + ', ' : category
                      })}
                    </Title>
                  </Col>
                  <Col span={8}>
                    <Button icon={<PlusOutlined />} onClick={handleaddCategoryClick}>Add
                    </Button>
                  </Col>
                  <Modal title="Select More Categories" visible={CategoryModalVisible} onOk={handleCategorySave} onCancel={handleModalCancel}>
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
                <Row justify="start" style={textStyle} gutter={12}>
                  <Col span={16}>
                    {!DateSelectVisible ?                     <Title level={4}>Book Read: {BookData.dateRead.split('T')[0]}</Title>
                    :     <DatePicker onChange={handleDateSelection}/>
                  }
                  </Col>
                  <Col span={8}>
                    <Button icon={<CalendarOutlined />} onClick={handleDateChange}>{!DateSelectVisible ? 'Change' : 'Save'}</Button>
                  </Col>
                </Row>

                <Row justify="center">
                  <Col span={24}>
                    <Text strong>Rate it: </Text>
                  </Col>
                </Row>
                <Row justify="center" style={textStyle} gutter={32}>
                  <Col span={24}>
                    <Rate allowHalf value={Rating} onChange={handleRatingChange}/>
                  </Col>
                </Row>
              </Content>
            </Layout>

            <Row justify="center" style={layoutStyle} gutter={32}>
              <Col span={24}>
                <Title>Highlighted Notes</Title>
              </Col>
              <Col span={BookData.highlightnotes.length !== 0 ? 24 : 12} style={{ border: '1px solid black', padding: '5px', borderRadius: '5px' }}>
                <Space direction="vertical">
                  {BookData.highlightnotes.length !== 0 ? (
                    <> {BookData.highlightnotes.map(note => {
                      return (
                      <Text italic>{'> '} {note}</Text>
                      )
                    })}
                    </>
                  ) : (
                    <Text>No notes found. Upload notes to add them</Text>
                  )}
                </Space>
              </Col>
              <Col span={BookData.highlightnotes.length !== 0 ? 12 : 24}>
                <Button onClick={() => SetNoteAddModalVisible(true)}>Paste Highlighted Notes</Button>
              </Col>
            </Row>
            <Modal title="Paste Highlighted Notes" visible={NoteAddModalVisible} onOk={() => SetNoteAddModalVisible(false)} onCancel={() => SetNoteAddModalVisible(false)} style={{height: '700px', width: '600px'}}>
                    <TextArea  size="large" placeholder="Name..." autoSize={{ minRows: 3, maxRows: 5 }} onChange={handleHighNotesTyping} onPaste={handleHighNotesPaste} />
                  </Modal>

            <Row justify="center" style={layoutStyle} gutter={32}>
              <Col span={24}>
                <Space direction="vertical">
                  <Title>My Review</Title>
                  {BookData.review ? (
                      <Text>{BookData.review}</Text>
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
                  <Button onClick={handleSaveClick}>Save</Button>
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
