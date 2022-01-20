import React, { useState } from 'react'
import { Input, Button } from 'antd'

const SearchBook = () => {
  const [ISBN, SetISBN] = useState<String | undefined>(undefined)

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
            let bookData = json['items'][0]
            console.log(bookData)
          } else alert('No Books Found With The Current ISBN')
        })
      })
    }
  }

  return (
    <div>
      <Input placeholder="search book title" defaultValue={'0140278737'} onChange={handleTyping} onPaste={handlePaste} />
      <Button onClick={fetchData}>Fetch</Button>
    </div>
  )
}

export default SearchBook
