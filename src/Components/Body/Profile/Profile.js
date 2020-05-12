import React, { useState, useEffect } from 'react';
import firebase from 'firebase/app';
import { useFirestore, isLoaded } from 'react-redux-firebase';
import Post from '../Posts/Post';
import { useSelector } from 'react-redux'

const Profile = props => {
  const auth = firebase.auth();
  const db = useFirestore();
  const [currentProfile, setCurrentProfile] = useState(null);
  const posts = useSelector(state => state.firestore.ordered.posts);

  useEffect(() => {
    if((isLoaded(auth)) && (auth.currentUser != null)) {
      const currentUserProfile = db.collection('profiles').doc(auth.currentUser.photoURL);
      currentUserProfile.get().then(function(profile) {
        setCurrentProfile(profile.data());
      }).catch(function(error) {
        console.log(error.message);
      });
    } else {
      return <h3>Loading...</h3>
    }
  }, []);
  let topPosts;
  if((isLoaded(auth)) && (auth.currentUser != null)) {
    const userPosts = posts.filter(post => post.author == auth.currentUser.displayName);
    topPosts = userPosts.sort((a, b) => b.score - a.score);
  }

  console.log('updating');
  return (
    <div className='profile'>

    {currentProfile != null ? 
      <div className='profileHeader'>
        <h2>{currentProfile.displayName}</h2>
        <h3>{currentProfile.email}</h3>
        {topPosts.map((post, index) => {
          if(index < 6) {
            return (
              <Post post={post} key={index} />
            )
          }
        })}
      </div> :
      <h3>Loading...</h3>
    }
    </div>
  )
}

export default Profile;