const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

test('dummy returns one', () => {
  const blogs = []

  const result = listHelper.dummy(blogs)
  assert.strictEqual(result, 1)
})

describe('total likes', () => {
    const listWithOneBlog = [
      {
        _id: '5a422aa71b54a676234d17f8',
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
        likes: 5,
        __v: 0
      }
    ]

    const biggerList = [
      {
        _id: '5a422aa71b54a676234d17f8',
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
        likes: 5,
        __v: 0
      },
      {
        _id: '5a422aa71b54a4376234d17f8',
        title: '1984',
        author: 'George Orwell',
        url: 'https://homepages.cwi.nl/~storm/teaching/reader/D7jkstra68.pdf',
        likes: 21,
        __v: 0
      },
      {
        _id: '5a422aa71454234d17f8',
        title: 'i miss her',
        author: 'c z',
        url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dij87tra68.pdf',
        likes: 10,
        __v: 0
      },
    ]
  
    test('when list has only one blog, equals the likes of that', () => {
      const result = listHelper.totalLikes(listWithOneBlog)
      assert.strictEqual(result, 5)
    })

    test('of empty list is zero', () => {
      const emptyList = []
      const result = listHelper.totalLikes(emptyList)
      assert.strictEqual(result, 0)
      })

    test('when list has only one blog, equals the likes of that', () => {
      const result = listHelper.totalLikes(biggerList)
      assert.strictEqual(result, 36)
    })
  })

describe('favorite blog', () => {
    const biggerList = [
      {
        _id: '5a422aa71b54a676234d17f8',
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
        likes: 5,
        __v: 0
      },
      {
        _id: '5a422aa71b54a4376234d17f8',
        title: '1984',
        author: 'George Orwell',
        url: 'https://homepages.cwi.nl/~storm/teaching/reader/D7jkstra68.pdf',
        likes: 21,
        __v: 0
      },
      {
        _id: '5a422aa71454234d17f8',
        title: 'i miss her',
        author: 'c z',
        url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dij87tra68.pdf',
        likes: 10,
        __v: 0
      },
    ]

    test('of big list', () => {
      const result = listHelper.favoriteLikes(biggerList)
      assert.deepStrictEqual(result, biggerList[1])
      // console.log(result)
  })
  })

describe('most blogs', () => {
  const biggerList = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
      likes: 5,
      __v: 0
    },
    {
      _id: '5a422aa71b54a4376234d17f8',
      title: '1984',
      author: 'George Orwell',
      url: 'https://homepages.cwi.nl/~storm/teaching/reader/D7jkstra68.pdf',
      likes: 21,
      __v: 0
    },
    {
      _id: '42870587234834790',
      title: 'Homeaje a Cataluna',
      author: 'George Orwell',
      url: 'https://homepages.cwi.nl/~storm/teaching/reader/D7jkstra68.pdf',
      likes: 43,
      __v: 0
    },
    {
      _id: '5a422aa71454234d17f8',
      title: 'i miss her',
      author: 'c z',
      url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dij87tra68.pdf',
      likes: 10,
      __v: 0
    },
  ]

  test('of big list', () => {
    const result = listHelper.mostBlogs(biggerList)
    assert.deepStrictEqual(result, { author: 'George Orwell', blogs: 2 })
  })
})

describe('most likes', () => {
  const biggerList = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
      likes: 75,
      __v: 0
    },
    {
      _id: '5a422aa71b54a4376234d17f8',
      title: '1984',
      author: 'George Orwell',
      url: 'https://homepages.cwi.nl/~storm/teaching/reader/D7jkstra68.pdf',
      likes: 21,
      __v: 0
    },
    {
      _id: '42870587234834790',
      title: 'Homeaje a Cataluna',
      author: 'George Orwell',
      url: 'https://homepages.cwi.nl/~storm/teaching/reader/D7jkstra68.pdf',
      likes: 43,
      __v: 0
    },
    {
      _id: '5a422aa71454234d17f8',
      title: 'i miss her',
      author: 'c z',
      url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dij87tra68.pdf',
      likes: 10,
      __v: 0
    },
  ]

  test('of big list', () => {
    const result = listHelper.mostLikes(biggerList)
    assert.deepStrictEqual(result, { author: 'Edsger W. Dijkstra', likes: 75 })
  })
})