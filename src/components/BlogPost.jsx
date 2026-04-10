import { useParams } from 'react-router-dom'

export default function BlogPost({ blogs }) {
  const { id } = useParams()
  const post = blogs.find(b => b.id === parseInt(id))
  
  if (!post) {
    return <div className="container py-5">Blog not found</div>
  }
  
  return (
    <div className="container py-5">
      <h1>{post.title}</h1>
      <p>{post.content}</p>
      {/* full blog content */}
    </div>
  )
}