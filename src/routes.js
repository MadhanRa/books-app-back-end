const {
  addBookHandler, getAllBooksHandler, getBookByHandler, editBookByHandler, deleteBookByHandler,
} = require('./handler');

const routes = [
  {
    method: 'POST',
    path: '/books',
    handler: addBookHandler,
  },
  {
    method: 'GET',
    path: '/books',
    handler: getAllBooksHandler,
  },
  {
    method: 'GET',
    path: '/books/{bookId}',
    handler: getBookByHandler,
  },
  {
    method: 'PUT',
    path: '/books/{bookId}',
    handler: editBookByHandler,
  },
  {
    method: 'DELETE',
    path: '/books/{bookId}',
    handler: deleteBookByHandler,
  },
];

module.exports = routes;
