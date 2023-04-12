import {useState, useEffect} from 'react';
import axios from 'axios';
import {
  useToast,
  Container,
  Heading,
  Button,
  Stack,
  Card,
  CardBody,
  Text
} from '@chakra-ui/react';

const api = axios.create({ baseURL: "https://jsonplaceholder.typicode.com/"  });

function App() {
  const [posts, setPost] = useState(null);
  const [posting, setPosting] = useState(true);
  const toast = useToast();

  useEffect(() => { getPost() }, []);

  async function getPost() {
    setPosting(true)
    await api.get('posts')
      .then((response) => { setPost(response.data) })
      .catch((error) => {
        toast({
          title: `Error ${error.response.code}`,
          description: 'An error occured while getting post list',
          status: 'error',
          position: 'top-right',
          duration: 2000,
          isClosable: true,
        })
      });
    setPosting(false)
  }

  async function createPost() {
    setPosting(true)
    await api.post('posts', {
      title: 'Hello World!',
      body: 'This is a new post.'
    })
      .then((response) => { setPost([response.data, ...posts]) })
      .catch((error) => {
        toast({
          title: `Error ${error.response.code}`,
          description: 'An error occured while posting',
          status: 'error',
          position: 'top-right',
          duration: 2000,
          isClosable: true,
        })
      });
    setPosting(false)
  }

  async function deletePost(id) {
    setPosting(true)
    await api.delete(`posts/${id}`)
      .then(() => {
        posts.splice(posts.findIndex(post => post.id === id), 1);
        toast({
          title: `A post deleted`,
          status: 'success',
          position: 'top-right',
          duration: 2000,
          isClosable: true,
        })
      })
      .catch((error) => {
        toast({
          title: `Error ${error.response.code}`,
          description: 'An error occured while deleting a post',
          status: 'error',
          position: 'top-right',
          duration: 2000,
          isClosable: true,
        })
      });
    setPosting(false)
  }

  if (!posts) return 'No post found';

  return (
    <Container>
      <Heading as='h1'>Post List</Heading>
      <Button
        size='sm'
        colorScheme='blue'
        isLoading={posting}
        loadingText='Posting'
        onClick={createPost}
      >
        Post
      </Button>
      <Stack spacing='1rem' mt='1rem'>
        {posts.map((post, index) => (
          <Card key={index}>
            <CardBody>
              <Heading size='sm'>
                {post.title}
              </Heading>
              <Text mt='.5rem'>
                {post.body}
              </Text>
              <Stack direction='row' justify='end' w="100%" mt='.5rem'>
                <Button
                  size='sm'
                  colorScheme='red'
                  isLoading={posting}
                  loadingText='Deleting'
                  onClick={() => deletePost(post.id)}
                >
                  Delete
                </Button>
              </Stack>
            </CardBody>
          </Card>
        ))}
      </Stack>
    </Container>
  );
}

export default App;
