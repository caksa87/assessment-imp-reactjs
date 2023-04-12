import {useState, useEffect} from 'react';
import axios from 'axios';
import {
  useToast,
  Container,
  Heading,
  Stack,
  Card,
  CardBody,
  Text,
  Button
} from '@chakra-ui/react';

const apiBaseUrl = 'https://jsonplaceholder.typicode.com/';

function App() {
  const [posts, setPost] = useState(null);
  const [posting, setPosting] = useState(true);
  const toast = useToast();

  useEffect(() => {
    axios.get(`${apiBaseUrl}posts`)
      .then((response) => {
        setPost(response.data)
        setPosting(false)
      })
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
  }, []);

  function createPost() {
    setPosting(true)
    axios.post(`${apiBaseUrl}posts`, {
      title: 'Hello World!',
      body: 'This is a new post.'
    })
    .then((response) => {
      setPost([response.data, ...posts])
      setPosting(false)
    })
    .catch((error) => {
      toast({
        title: `Error ${error.response.code}`,
        description: 'An error occured while posting',
        status: 'error',
        position: 'top-right',
        duration: 2000,
        isClosable: true,
      })
      setPosting(false)
    });
  }

  if (!posts) return null;

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
            </CardBody>
          </Card>
        ))}
      </Stack>
    </Container>
  );
}

export default App;
