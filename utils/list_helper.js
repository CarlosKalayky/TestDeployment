const _ = require('lodash')

const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favoriteLikes = (blogs) => {
    if (blogs.length === 0) {
        return 0
    }

    return blogs.reduce((max, blog) => {
        return blog.likes > max.likes ? blog : max
    })
}

const mostBlogs = (blogs) => {
    if (blogs.length === 0) {
        return 0
    }
    
    //to count the number of blogs that each author has
    const blogsFromAuthor = _.countBy(blogs, 'author')

    //convert to array of 2 elements, and then we create the array of author and count from the pairs created in this method
    const authorCount = _.toPairs(blogsFromAuthor)

    const [author, count] = _.maxBy(authorCount, ([author, count]) => count)
    // console.log(authorCount, count)
    return { author, blogs : count }
}

const mostLikes = (blogs) => {
    if (blogs.length === 0) {
        return 0
    }
    
    //to count the number of blogs that each author has
    const likesFromAuthor = _.reduce(blogs, (result, blog) => {
        if (!result[blog.author]) {
            result[blog.author] = 0
        }
        result[blog.author] += blog.likes
        // console.log(blog.author, blog.likes)
        return result
    }, {})

    const authorLikes = _.toPairs(likesFromAuthor)

    const [author, likes] = _.maxBy(authorLikes, ([author, likes]) => likes)

    // console.log(authorLikes, likes)
    return { author, likes }
}


module.exports = { dummy, totalLikes, favoriteLikes, mostBlogs, mostLikes }