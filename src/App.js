import {useState, useEffect} from 'react';
import axios from 'axios';
import {
  Container,
  Heading,
  Stack,
  Card,
  CardBody,
  Text
} from '@chakra-ui/react';

const apiBaseUrl = 'https://jsonplaceholder.typicode.com/';

function App() {
  const [posts, setPost] = useState(null);

  useEffect(() => {
    axios.get(`${apiBaseUrl}posts`).then((response) => {
      setPost(response.data);
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
