import {useState, useEffect} from 'react';
import axios from 'axios';
import {
  Container,
  Heading,
  Stack,
  Card,
  CardBody,
  Text,
  useToast
} from '@chakra-ui/react';

const apiBaseUrl = 'https://jsonplaceholder.typicode.com/';

function App() {
  const [posts, setPost] = useState(null);
  const toast = useToast();

  useEffect(() => {
    axios.get(`${apiBaseUrl}posts`)
      .then((response) => { setPost(response.data) })
      .catch((error) => {
        toast({
          title: `Error ${error.response.code}`,
          description: 'Ann error occured while getting post list',
          status: 'error',
          position: 'top-right',
          duration: 2000,
          isClosable: true,
        })
      });
  }, []);

  if (!posts) return null;

  return (
    <Container>
      <Heading as='h1'>Post List</Heading>
      <Stack spacing='1rem'>
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
