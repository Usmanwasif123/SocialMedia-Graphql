import { useContext, useRef, useState } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import { useMutation, useQuery } from "@apollo/client";
import gql from "graphql-tag";
import moment from "moment";
import {Grid, Card, Button, Icon, Label, Image, Form } from 'semantic-ui-react';


import { AuthContext } from "../context/auth";
import DeleteButton from "../components/DeleteButton";
import LikeButton from '../components/LikeButton';
import MyPopup from '../util/Popup';

const SinglePost = (props) => {
    const { postId } = useParams();
    const {user } = useContext(AuthContext);
    const navigate = useNavigate();
    const commentInputRef = useRef(null);
    const [comment, setComment] = useState('');

    const {data} =useQuery(FETCH_POST_QUERY, {
        variables: {
            postId
        },
    });
    

    const post = data && data.getPost ? data.getPost : null;

    const [submitComment] = useMutation(SUBMIT_COMMENT_MUTATION, {
        update(){
            setComment('');
            commentInputRef.current.blur();
        },
        variables: {
            postId,
            body: comment
        }
    });

    function deletePostCallback() {
        navigate('/');
    }

    let postMarkup;
    if(!post){
        postMarkup = <p>Loading post..</p>
    } else {
        const {
            id, 
            body, 
            createdAt, 
            username, 
            comments, 
            likes, 
            likeCount, 
            commentCount 
        } = post;

        postMarkup = (
            <Grid>
                <Grid.Row>
                    <Grid.Column width={2}>
                    <Image 
                    src='https://react.semantic-ui.com/images/avatar/large/molly.png'
                    size="small"
                    float="right"/>
                    </Grid.Column>
                    <Grid.Column width={10}>
                    <Card fluid>
                        <Card.Content>
                            <Card.Header>{username}</Card.Header>
                            <Card.Meta>{moment(createdAt).fromNow()}</Card.Meta>
                            <Card.Description>{body}</Card.Description>
                        </Card.Content>
                        <hr/>
                        <Card.Content extra>
                            <LikeButton user={user} post={{id, likeCount, likes}}/>
                            <MyPopup content="Comment on post">
                                <Button 
                                    as="div"
                                    labelPosition="right"
                                    onClick={() => console.log('Comment on post')}
                                >
                                    <Button basic color="blue">
                                        <Icon name="comments"/>
                                    </Button>
                                    <Label basic color="blue" pointing="left">
                                        {commentCount}
                                    </Label>
                                </Button>
                            </MyPopup>
                            {user && user.username === username && (
                                <DeleteButton postId={id} callback={deletePostCallback}/>
                            )}
                        </Card.Content>
                    </Card>
                    {user && <Card fluid>
                        <Card.Content>
                        <p>Post a comment</p>
                        <Form>
                            <div className="ui action input fluid">
                                <input
                                type="text"
                                placeholder="Comment.."
                                name="comment"
                                value={comment}
                                onChange={e => setComment(e.target.value)}
                                ref={commentInputRef}
                                />
                                <button type="submit"
                                className="ui button teal"
                                disabled={comment.trim() === ''}
                                onClick={submitComment}
                                >
                                    Submit
                                </button>
                            </div>
                        </Form>
                        </Card.Content>
                    </Card>}
                    {comments.map(comment => (
                      <Card fluid key={comment.id}>
                        <Card.Content>
                            {user && user.username === comment.username && (
                                <DeleteButton postId={id} commentId={comment.id}/>
                            )}
                            <Card.Header>{username}</Card.Header>
                            <Card.Meta>{moment(comment.createdAt).fromNow()}</Card.Meta>
                            <Card.Description>{comment.body}</Card.Description>
                        </Card.Content>
                      </Card>  
                    ))}
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        )
    }
    return postMarkup;
}

const SUBMIT_COMMENT_MUTATION =gql`
    mutation($postId: String!, $body: String!){
        createComment(postId: $postId, body: $body){
            id
            comments{
                id
                body
                createdAt
                username
            }
            commentCount
        }
    }
`

const FETCH_POST_QUERY = gql`
    query($postId: ID!){
        getPost(postId: $postId){
            id
            body
            createdAt
            username
            likeCount
            likes{
                username
            }
            commentCount
            comments{
                id 
                username
                createdAt
                body
            }
        }
    }
`



export default SinglePost;