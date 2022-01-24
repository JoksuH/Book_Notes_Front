import React, { useState, useEffect } from 'react'
import { Button, Row, Col } from 'antd'
import BookDataCard from './../bookdatacard/BookDataCard'
import { AnyARecord } from 'dns'

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

   useEffect(() => {
      fetch(`http://localhost:4000/books/`).then((response) => {
        response.json().then((json) => {
          if (json) {
            console.log(json)
            SetBooksData(json)
          } else alert('No Books Found With The Current ISBN')
        })
      })
    }, [])

  return (
    <div>  
        {BooksData && BooksData.map((book:bookData) => {
            return (
                <div key={book._id}>
                    <BookDataCard BookData={book} small={true}/>
                </div>
            )
        })}
    </div>
  )
}

export default Mylibrary
