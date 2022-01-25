import React, { useState, useEffect } from 'react'
import { Pagination, Row, Input, Empty } from 'antd'
import BookDataCard from './../bookdatacard/BookDataCard'

interface bookData {
  _id: string
  title: string
  description: string
  imageLinks: imagelinks
  author: string
  industryIdentifiers: isbnData[]
}

interface isbnData {
  identifier: String
}

interface imagelinks {
  thumbnail: string
}

const inputRowStyle = { width: '50vw', height: '10vh', margin: 'auto', marginTop: '1vh', paddingTop: '20px' }

const Mylibrary: React.FC = () => {
  const [BooksData, SetBooksData] = useState<bookData[] | undefined>(undefined)
  const [CurrentPageBookData, SetCurrentPageBookData] = useState<bookData[] | undefined>(undefined)
  const [Filter, SetFilter] = useState<string | undefined>(undefined)
  const [ResultsAmount, SetResoultsAmount] = useState<number | undefined>(undefined)

  useEffect(() => {
    fetch(`http://localhost:4000/books/`).then((response) => {
      response.json().then((json) => {
        if (json) {
          SetBooksData(json)
          SetResoultsAmount(json.length)
          SetCurrentPageBookData(json.slice(0, 5))
        } else alert('No Books Found With The Current ISBN')
      })
    })
  }, [])

  const handlePageChange = (page: number) => {
    if (BooksData) {
      if (Filter) {
        let filteredBooks: bookData[] = BooksData.filter((book) => book.title.toLowerCase().includes(Filter.toLowerCase()) || book.author.toLowerCase().includes(Filter.toLowerCase()))
        SetResoultsAmount(filteredBooks.length)
        SetCurrentPageBookData(filteredBooks.slice((page - 1) * 5, page * 5))
        filteredBooks.length > 0 ? SetCurrentPageBookData(filteredBooks.slice(0, 5)) : SetCurrentPageBookData(undefined)
      } else {
        SetCurrentPageBookData(BooksData.slice((page - 1) * 5, page * 5))
        SetResoultsAmount(BooksData.length)
      }
    }
  }
  const handleFilterTyping = (event: React.ChangeEvent<HTMLInputElement>) => {
    const text: string = event.target.value
    SetFilter(text)
    if (BooksData) {
      let filteredBooks: bookData[] = BooksData.filter((book) => book.title.toLowerCase().includes(text.toLowerCase()) || book.author.toLowerCase().includes(text.toLowerCase()))
      SetResoultsAmount(filteredBooks.length)
      filteredBooks.length > 0 ? SetCurrentPageBookData(filteredBooks.slice(0, 5)) : SetCurrentPageBookData(undefined)
    }
  }

  return (
    <div style={inputRowStyle}>
      <Row>
        <Input placeholder="Filter Books" onChange={handleFilterTyping}></Input>
      </Row>
      {CurrentPageBookData ? (
        <>
          {CurrentPageBookData.map((book: bookData, index:number) => {
            return (
              <div key={book._id}>
                <BookDataCard BookData={book} small={true} index={index} />
              </div>
            )
          })}
          <Pagination defaultCurrent={1} defaultPageSize={5} total={ResultsAmount} onChange={handlePageChange} showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`} style={{ marginTop: '2vh' }} hideOnSinglePage={true} />
        </>
      ) : (
        <Empty
          style={{ marginTop: '15vh' }}
          description={
            <span>
              No Books Found!
            </span>
          }
        />
      )}
    </div>
  )
}

export default Mylibrary
