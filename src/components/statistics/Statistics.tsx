import React, { useState } from 'react'
import { Input, Button, message } from 'antd'
import BookDataCard from './../bookdatacard/BookDataCard'

interface bookData {
  title: String,
  description: String,
  categories: string[],
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

const Statistics: React.FC = () => {
  const [ISBN, SetISBN] = useState<String | undefined>(undefined)
  const [BookData, SetBookData] = useState<bookData | undefined>(undefined)


  return (
    <div>
      <Button>Fetch</Button>
    </div>
  )
}

export default Statistics
