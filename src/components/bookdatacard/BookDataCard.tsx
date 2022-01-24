import React, { useState } from 'react'
import { Button, Row, Col, Image, Typography, Layout, Rate } from 'antd'

const textStyle = { marginBottom: '3vh' }
const layoutStyle = { width: '50vw', margin: 'auto', marginTop: '2vh', border: '1px solid black', borderRadius: '10px', padding: '20px', backgroundColor: 'white' }

interface data {
  BookData: bookData
  onBookAdd?: () => void
  small?: Boolean
  rateable?: Boolean
}

interface bookData {
  title: String
  description: String
  imageLinks?: imagelinks | undefined,
  imageurl?: string,
  authors?: String[],
  author?: String,
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

const BookDataCard: React.FC<data> = ({ BookData, onBookAdd, small, rateable }) => {
  const [Saved, SetSaved] = useState<Boolean>(false)

  console.log(BookData)

  const onAddLibrary = () => {
    SetSaved(true)
    if (onBookAdd)
    onBookAdd()
  }

  const onAddWishlist = () => {}

  const onRemove = () => {
    SetSaved(false)
  }
  return (
    <div>
      {BookData && (
        <Layout style={layoutStyle}>
          {BookData.imageLinks && (
            <Sider style={{ backgroundColor: 'white', padding: '10px' }}>
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
              {BookData.authors && 
              <Col span={12}>
                Author:<Title>{BookData.authors[0]}</Title>
              </Col>
              }
               {BookData.author && 
              <Col span={12}>
                Author:<Title>{BookData.author}</Title>
              </Col>
              }
            </Row>
            <Row justify="center" style={textStyle} gutter={12}>
              <Col span={24}>
                <Text italic>{BookData.description}</Text>
              </Col>
            </Row>
            {!small && (
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
            )}
          </Content>
        </Layout>
      )}
    </div>
  )
}

BookDataCard.defaultProps = {
  small: false,
  rateable: false,
}

export default BookDataCard