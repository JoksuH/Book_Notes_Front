import React, { useState, useEffect } from 'react'
import { Pagination } from 'antd'
import BookDataCard from './../bookdatacard/BookDataCard'

interface bookData {
 _id: string, 
  title: String,
  description: String,
  imageLinks: imagelinks,
  authors: String[],
  industryIdentifiers: isbnData[]
}

interface isbnData {
  identifier: String
}

interface imagelinks {
  thumbnail: string
}

const Mylibrary: React.FC = () => {
  const [BooksData, SetBooksData] = useState<any | undefined>(undefined)
  const [CurrentPageBookData, SetCurrentPageBookData] = useState<any | undefined>(undefined)

   useEffect(() => {
      fetch(`http://localhost:4000/books/`).then((response) => {
        response.json().then((json) => {
          if (json) {
            SetBooksData(json)
            SetCurrentPageBookData(json.slice(0,5))
          } else alert('No Books Found With The Current ISBN')
        })
      })
    }, [])

    const handlePageChange = (page: number) => {
      SetCurrentPageBookData(BooksData.slice((page - 1) * 5, page * 5))
    }

  return (
    <div>  
        {CurrentPageBookData && CurrentPageBookData.map((book:bookData) => {
            return (
                <div key={book._id}>
                    <BookDataCard BookData={book} small={true}/>
                </div>
            )
        })}
        <Pagination defaultCurrent={1} defaultPageSize={5} total={6} onChange={handlePageChange} style={{marginTop: '2vh'}} />
    </div>
  )
}

export default Mylibrary
