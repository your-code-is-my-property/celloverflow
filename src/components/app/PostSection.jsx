import React, { useEffect, useState } from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import { useSelector } from 'react-redux';
import { useToast } from '@chakra-ui/react';
import { PostContainer, Post } from '../../styles/appStyles';
import { getAllQuestions } from '../../firebase/helpers/questionHelper';

export default function PostSection() {
  const [questions, setQuestions] = useState([]);
  const [isLoading, setisLoading] = useState(true);

  const showToast = useToast();
  const user = useSelector(state => state.user?.user);

  useEffect(() => {
    if (!user) return;
    getAllQuestions().then(questionsFromFirestore => {
      setQuestions(questionsFromFirestore);
    }).catch(() => {
      showToast({
        title: 'Failed to fetch data 😭',
        duration: 3000,
        isClosable: true,
        position: 'top-right',
        status: 'error',
      });
    })
    setisLoading(false);
  }, [showToast, user])

  return (
    <PostContainer>
      {isLoading && (
        <SkeletonTheme color="var(--secondary-color)" highlightColor="#444">
          <Skeleton height={260} count={3} style={{ borderRadius: '25px', marginBottom: "10px" }} />
        </SkeletonTheme>
      )}
      {!isLoading && questions.map(question => (
        <Post>
          <h3>{question?.title}</h3>
          <p>{question?.description}</p>
          <div className='bottom'>
            <div className='tags'>
              {question?.tags.map(tag => <span>{tag}</span>)}
            </div>
            <p>asked by <span>@{question?.username}</span></p>
          </div>
        </Post>
      ))}
      {/* <Post>
        <h3>Why I’m getting headache ??</h3>
        <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown ✨</p>
        <div className='bottom'>
          <div className='tags'>
            <span>head</span>
            <span>pain in head</span>
          </div>
          <p>asked by <span>@johndoe</span></p>
        </div>
      </Post> */}
    </PostContainer>
  );
}