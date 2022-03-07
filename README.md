Book Notes - To keep track of what you've read
============

The idea of this project came from my grandma, who told me that she had kept a diary of books she had read throughout her life and how I should do the same.
Inspired by her idea, I decided to code my own book notes tracker as a project.

This is the frontend of that projectwhich was created using React, Typescript and using Ant Design for design and Framer Motion for animations.

The backend can be found at https://github.com/JoksuH/Book_Notes_Back

## Goals

- Try out Ant Design design framework.
- See how non-strict Typescript would feel out. (Feels more natural when it's on, in my opinion)


## Features
- Get book information based on ISBN (uses Google's book API)
- User can add manual notes, an review and a star rating
- The user can also upload notes highlighted from a Kindle reader app
- Books get default categories based on API suggestions, but others can also be selected and created as needed
- Books read by categories can easily be seen in the Categories -page

## To-do
- Statistics page to follow how many books have been read through time
- Notes page that would make it easier to collect notes from many books in same place
- Design has been currently on been made for desktop PC. Mobile design could be designed in the future
- Bug fixes

Listing of books read
![Books Listing](https://i.imgur.com/duIVzmD.jpg)

Example book listing with a review
![Single Book Listing](https://i.imgur.com/WfrNvE8.jpg)

## Setup
Clone this repo to your desktop and run `npm install` to install all the dependencies.

---

## Usage
After you clone this repo to your desktop, go to its root directory and run `npm install` to install its dependencies.

Once the dependencies are installed, you can run  `npm start` to start the application. You will then be able to access it at localhost:3000

If you want to run the project from your computer, you need to run the backend at the same time as the front end using a port of your choice. The default port address is localhost:5000

---
