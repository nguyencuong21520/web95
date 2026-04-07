import express from 'express';
import axios from 'axios';

const app = express()
const PORT = 3032;
const JSON_SERVER_URL = 'http://localhost:3033'

app.get('/', (req, res)=>{
    res.json({message: 'server is running'})
})

//url : /comments/id => get comment by id
app.get('/comments/:id', async (req, res)=>{
    try{
        const commentId = req.params.id

        if(!commentId){
            throw new Error('comment id is required')
        }
        //Get comment by id
        const dataComment = await axios.get(`${JSON_SERVER_URL}/comments/${commentId}`)
        const comment = dataComment.data
        if(!comment){
            throw new Error('comment not found')
        }
        //Get post by id
        const dataPost = await axios.get(`${JSON_SERVER_URL}/posts/${comment.postId}`)
        const post = dataPost.data
        if(!post){
            throw new Error('post not found')
        }
        //Get user by id
        const dataUser = await axios.get(`${JSON_SERVER_URL}/users/${comment.authorId}`)
        const user = dataUser.data
        if(!user){
            throw new Error('user not found')
        }
        //merge data
        const mergedData = {
            ...comment,
            post,
            user
        }
        delete mergedData.postId
        delete mergedData.authorId
    
        res.json({message: 'comment found', data: mergedData})

    }catch(error){
        res.status(500).json({message: error.message})
        return
    } 
})


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})


// {
//     "id": "CMT001",
//     "postId": {
//         "id": "PS001",
//         "content": "Nội dung học về JSON Server!",
//         "authorId": "US001"
//       },
//     "content": "Bài học này rất ý nghĩa! Cảm ơn MindX!",
//     "authorId": {
//         "id": "US002",
//         "userName": "Nobi Nobita aaaa"
//       }
//   }