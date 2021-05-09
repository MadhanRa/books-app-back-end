const { nanoid } = require('nanoid');
const books = require('./books');

const addBookHandler = (request, h) => {
  const {
    name = 'name', year, author, summary, publisher, pageCount, readPage, reading,
  } = request.payload;

  const id = nanoid(16);
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;
  const finished = pageCount === readPage;

  const newBook = {
    id, name, year, author, summary, publisher, pageCount, readPage, finished, reading, insertedAt, updatedAt,
  };

  if (name === 'name' || readPage > pageCount) {
    let setMessage;
    if (name === 'name') {
      setMessage = 'Gagal menambahkan buku. Mohon isi nama buku';
    }
    if (readPage > pageCount) {
      setMessage = 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount';
    }
    const response = h.response({
      status: 'fail',
      message: setMessage,
    });
    response.code(400);
    return response;
  }

  books.push(newBook);

  const isSuccess = books.filter((book) => book.id === id).length > 0;

  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    });
    response.code(201);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal ditambahkan',
  });
  response.code(500);
  return response;
};

const getAllBooksHandler = (request, h) => {
  const { name = 'name', reading = 'reading', finished = 'finished' } = request.query;
  const allBooks = [];
  let filteredBook;

  if (!(name === 'name')) {
    // Kalau query name ada, dicari buku dengan name yang sama
    filteredBook = books.filter((n) => n.name.toUpperCase().includes(name.toUpperCase()));
  } else if (!(reading === 'reading')) {
    // Kalau query reading ada, dicari buku dengan boolean reading yang sama
    filteredBook = books.filter((n) => n.reading === (parseInt(reading, 10) === 1));
  } else if (!(finished === 'finished')) {
    // Kalau query finished ada, dicari buku dengan boolean finished yang sama
    filteredBook = books.filter((n) => n.finished === (parseInt(finished, 10) === 1));
  } else {
    filteredBook = books;
  }

  Object.values(filteredBook).forEach((book) => allBooks.push({
    id: book.id,
    name: book.name,
    publisher: book.publisher,
  }));

  const response = h.response({
    status: 'success',
    data: {
      books: allBooks,
    },
  });

  response.code(200);
  return response;
};

const getBookByHandler = (request, h) => {
  const { bookId } = request.params;

  const book = books.filter((n) => n.id === bookId)[0];

  if (book !== undefined) {
    return {
      status: 'success',
      data: {
        book,
      },
    };
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });
  response.code(404);
  return response;
};

const editBookByHandler = (request, h) => {
  const { bookId } = request.params;

  const {
    name = 'name', year, author, summary, publisher, pageCount, readPage, reading,
  } = request.payload;

  if (name === 'name' || readPage > pageCount) {
    let setMessage;
    if (name === 'name') {
      setMessage = 'Gagal memperbarui buku. Mohon isi nama buku';
    }
    if (readPage > pageCount) {
      setMessage = 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount';
    }
    const response = h.response({
      status: 'fail',
      message: setMessage,
    });
    response.code(400);
    return response;
  }

  const updatedAt = new Date().toISOString();

  const index = books.findIndex((note) => note.id === bookId);

  if (index !== -1) {
    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      updatedAt,
    };

    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

const deleteBookByHandler = (request, h) => {
  const { bookId } = request.params;

  const index = books.findIndex((note) => note.id === bookId);

  if (index !== -1) {
    books.splice(index, 1);
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

module.exports = {
  addBookHandler, getAllBooksHandler, getBookByHandler, editBookByHandler, deleteBookByHandler,
};
