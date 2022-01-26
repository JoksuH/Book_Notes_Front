import React, { useState, useEffect } from 'react'
import { Button, Row, Col, Image, Typography, Layout, Rate } from 'antd'
import { motion } from 'framer-motion'
import { useParams } from 'react-router-dom'

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
  imageurl?: string
  author: string
  industryIdentifiers: isbnData[]
}

interface isbnData {
  identifier: String
}

const { Title, Text } = Typography
const { Sider, Content } = Layout

const BookPage: React.FC = () => {
  const [Saved, SetSaved] = useState<Boolean>(false)
  const [BookData, SetBookData] = useState<bookData | undefined>(undefined)
  const { booktitle } = useParams()

  useEffect(() => {
    fetch(`http://localhost:4000/books/${booktitle}`).then((response) => {
      response.json().then((json) => {
        if (json[0]) {
          SetBookData(json[0])
        } else alert('No Books Found With The Current ISBN')
      })
    })
  }, [])

  return (
    <motion.div initial="hidden" animate="show" variants={listItem}>
      {BookData && (
        <Layout style={layoutStyle}>
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
            <Row justify="center" style={textStyle} gutter={32}>
              {!Saved ? (
                <>
                  <Col span={12}>
                    <Button type="primary">Add a Note</Button>
                  </Col>
                  <Col span={12}>
                    <Button>View Notes</Button>
                  </Col>
                </>
              ) : (
                <Col span={24}>
                  <Button>Add a Review</Button>
                </Col>
              )}
            </Row>
            <Col span={24}>
              <Button size="large">Open</Button>
            </Col>
          </Content>
        </Layout>
      )}
    </motion.div>
  )
}

BookPage.defaultProps = {
  small: false,
  rateable: false,
}

export default BookPage
