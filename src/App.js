import {useState, useEffect} from 'react';
import axios from 'axios';
import {useForm} from 'react-hook-form';
import {
  useToast,
  useDisclosure,
  Container,
  Heading,
  Card,
  CardHeader,
  CardBody,
  Stack,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  Textarea,
  Button,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton
} from '@chakra-ui/react';

const api = axios.create({ baseURL: "https://jsonplaceholder.typicode.com/"  });

function App() {
  const {register, handleSubmit, formState: {errors}} = useForm();
  const {register: registerEdit, handleSubmit: handleSubmitEdit, setValue, formState: {errors: errorsEdit}} = useForm();
  const submitNewPost = (data, e) => createPost(data, e);
  const submitUpdatePost = (data, e) => updatePost(data, e);
  const [posts, setPosts] = useState(null);
  const [posting, setPosting] = useState(true);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const toast = useToast();
  const {isOpen, onOpen, onClose} = useDisclosure();

  useEffect(() => { getPost() }, []);

  async function getPost() {
    setPosting(true)
    await api.get('posts')
      .then((response) => { setPosts(response.data) })
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

  async function createPost(data, e) {
    setPosting(true)
    await api.post('posts', {
      title: data.inputTitle,
      body: data.inputBody
    })
      .then((response) => {
        setPosts([response.data, ...posts])
        e.target.reset()
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
      });
    setPosting(false)
  }

  function selectPost(post) {
    setSelectedPostId(post.id)
    setValue('inputTitle', post.title)
    setValue('inputBody', post.body)
    onOpen()
  }

  async function updatePost(data, e) {
    setPosting(true)
    await api.patch(`posts/${selectedPostId}`, {
      title: data.inputTitle,
      body: data.inputBody
    })
      .then(() => {
        posts[posts.findIndex(post => post.id === selectedPostId)].title = data.inputTitle;
        posts[posts.findIndex(post => post.id === selectedPostId)].body = data.inputBody;
        onClose()
        e.target.reset()
        toast({
          title: `A post updated`,
          status: 'success',
          position: 'top-right',
          duration: 2000,
          isClosable: true,
        })
      })
      .catch((error) => {
        toast({
          title: `Error ${error.response.code}`,
          description: 'An error occured while updating a post',
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
    <div>
      <Container>
        <Heading as='h1'>Post List</Heading>
        <Card>
          <CardHeader>
            <Heading as='h2'>Add a new post</Heading>
          </CardHeader>
          <CardBody>
            <form onSubmit={handleSubmit(submitNewPost)}>
              <Stack spacing='1rem'>
                <FormControl>
                  <FormLabel>Title</FormLabel>
                  <Input {...register('inputTitle', { required: true })} type='text' isInvalid={errors.inputTitle} />
                  {errors.inputTitle && <FormErrorMessage>Title is required</FormErrorMessage>}
                </FormControl>
                <FormControl>
                  <FormLabel>Body</FormLabel>
                  <Textarea
                    {...register('inputBody', { required: true })}
                    rows='5'
                    resize='none'
                    isInvalid={errors.inputBody}
                    onKeyPress={e => e.key === 'Enter' && e.preventDefault()}
                  />
                  {errors.inputBody && <FormErrorMessage>Body is required</FormErrorMessage>}
                </FormControl>
                <Button
                  type='submit'
                  size='sm'
                  colorScheme='blue'
                  isLoading={posting}
                  loadingText='Posting'
                >
                  Post
                </Button>
              </Stack>
            </form>
          </CardBody>
        </Card>
        <Heading as='h2' mt='3rem'>Posted</Heading>
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
                    colorScheme='blue'
                    isLoading={posting}
                    loadingText='Edit'
                    onClick={() => selectPost(post)}
                  >
                    Edit
                  </Button>
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
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Update post</ModalHeader>
          <ModalCloseButton />
          <form onSubmit={handleSubmitEdit(submitUpdatePost)}>
            <ModalBody>
              <Stack spacing='1rem'>
                <FormControl>
                  <FormLabel>Title</FormLabel>
                  <Input {...registerEdit('inputTitle', { required: true })} type='text' isInvalid={errorsEdit.inputTitle} />
                  {errorsEdit.inputTitle && <FormErrorMessage>Title is required</FormErrorMessage>}
                </FormControl>
                <FormControl>
                  <FormLabel>Body</FormLabel>
                  <Textarea
                    {...registerEdit('inputBody', { required: true })}
                    rows='5'
                    resize='none'
                    isInvalid={errorsEdit.inputBody}
                    onKeyPress={e => e.key === 'Enter' && e.preventDefault()}
                  />
                  {errorsEdit.inputBody && <FormErrorMessage>Body is required</FormErrorMessage>}
                </FormControl>
              </Stack>
            </ModalBody>
            <ModalFooter>
              <Button
                type='submit'
                size='sm'
                mr='.5rem'
                isLoading={posting}
                loadingText='Updating'
                colorScheme='blue'
              >
                Update post
              </Button>
              <Button
                type='button'
                size='sm'
                color='gray'
                isLoading={posting}
                onClick={onClose}
              >
                Cancel
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </div>
  );
}

export default App;
