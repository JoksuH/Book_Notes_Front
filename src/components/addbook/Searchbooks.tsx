import React, { useState } from 'react'
import { Input, Button } from 'antd'
import BookDataCard from './BookDataCard'

interface bookData {
  title: String
  description: String
  imageLinks: imagelinks
  authors: String[]
}

interface imagelinks {
  thumbnail: string
}

const SearchBook: React.FC = () => {
  const [ISBN, SetISBN] = useState<String | undefined>(undefined)
  const [BookData, SetBookData] = useState<bookData | undefined>(undefined)

  const handleTyping = (event: React.ChangeEvent<HTMLInputElement>) => {
    SetISBN(event.target.value)
  }

  const handlePaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
    SetISBN(event.clipboardData.getData('text'))
  }

  const fetchData = () => {
    if (ISBN) {
      fetch(`https://www.googleapis.com/books/v1/volumes?q=isbn:${ISBN}`).then((response) => {
        response.json().then((json) => {
          if (json['items']) {
            let bookData = json['items'][0]['volumeInfo']
            console.log(bookData)
            SetBookData(bookData)
          } else alert('No Books Found With The Current ISBN')
        })
      })
    }
  }

  return (
    <div>
      <Input placeholder="search book title" defaultValue={'0140278737'} onChange={handleTyping} onPaste={handlePaste} />
      <Button onClick={fetchData}>Fetch</Button>
      {BookData && (
       <BookDataCard BookData={BookData}/>
      )}
    </div>
  )
}

export default SearchBook
