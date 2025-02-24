const dummy = (blogs) => {
    return blogs.map(blog => ({
        title: blog.title,
        author: blog.author,
        likes: blog.likes
    }))
}