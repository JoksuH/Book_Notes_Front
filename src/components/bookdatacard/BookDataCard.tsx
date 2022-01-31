import React, { useState, useEffect } from 'react'
import { Button, Row, Col, Image, Typography, Layout, Rate } from 'antd'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

const textStyle = { marginBottom: '1vh' }
const layoutStyle = { width: '50vw', margin: 'auto', marginTop: '1vh', border: '1px solid black', borderRadius: '10px', padding: '20px', backgroundColor: 'white' }
const listItem = {
  hidden: { opacity: 0, x: -50 },
  show: (index: number) => ({ opacity: 1, x: 0, transition: { duration: 0.3, delay: index * 0.1 } }),
}

interface data {
  BookData: bookData
  onBookAdd?: () => void
  small?: Boolean
  rateable?: Boolean
  index?: number
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

const { Title, Text } = Typography
const { Sider, Content } = Layout

const BookDataCard: React.FC<data> = ({ BookData, onBookAdd, small, rateable, index }) => {
  const navigate = useNavigate()

  const [Saved, SetSaved] = useState<Boolean>(false)

  useEffect(() => {
    //Resets state when book is changed
    SetSaved(false)
  }, [BookData])

  const onAddLibrary = () => {
    SetSaved(true)
    if (onBookAdd) onBookAdd()
  }

  const onAddWishlist = () => {}

  const onRemove = () => {
    SetSaved(false)
  }

  const handleBookPageOpen = () => {
    const title: String = BookData.title
    navigate(`/book/${title}`)
  }
  return (
    <motion.div initial="hidden" animate="show" variants={listItem} custom={index}>
      {BookData && (
        <Layout style={layoutStyle}>
          {BookData.imageLinks && (
            <Sider style={{ backgroundColor: 'white', padding: '10px', height: '170vh' }}>
              <Image height="100%" width="100%" src={BookData.imageLinks.thumbnail} preview={false} />
            </Sider>
          )}
          {BookData.imageurl && (
            <Sider style={{ backgroundColor: 'white', padding: '10px' }}>
              <Image height="150px" src={BookData.imageurl} preview={false} />
            </Sider>
          )}
          <Content>
            <Row justify="center" style={textStyle} gutter={32}>
              <Col span={12}>
                Title: <Title>{BookData.title}</Title>
              </Col>
              {BookData.authors && (
                <Col span={12}>
                  Author:<Title>{BookData.authors[0]}</Title>
                </Col>
              )}
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
              <Col span={24}>
                <Text>
                  Categories:{' '}
                  {BookData.categories.map((category: string, index: number) => {
                    return index < BookData.categories.length - 1 ? category + ', ' : category
                  })}
                </Text>
              </Col>
            </Row>
            {!small ? (
              <>
                {rateable && (
                  <>
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
                  </>
                )}
                <Row justify="center" style={textStyle} gutter={32}>
                  {!Saved ? (
                    <>
                      <Col span={12}>
                        <Button type="primary" onClick={onAddLibrary}>
                          Add to Library
                        </Button>
                      </Col>
                      <Col span={12}>
                        <Button>Add to WishList</Button>
                      </Col>
                    </>
                  ) : (
                    <Col span={24}>
                      <Button onClick={onRemove}>Remove from Library</Button>
                    </Col>
                  )}
                </Row>
              </>
            ) : (
              <Col span={24}>
                <Button size="large" onClick={handleBookPageOpen}>
                  Open
                </Button>
              </Col>
            )}
          </Content>
        </Layout>
      )}
    </motion.div>
  )
}

BookDataCard.defaultProps = {
  small: false,
  rateable: false,
}

export default BookDataCard
