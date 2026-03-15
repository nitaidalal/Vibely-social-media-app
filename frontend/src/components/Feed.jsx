import React, { useEffect, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CiHeart } from "react-icons/ci";

import StoryCard from "./StoryCard";
import Post from "./Post";
import Navbar from "./navbar";

import { fetchPostsIfNeeded, fetchMorePosts } from "../redux/postSlice";
import { fetchStoriesIfNeeded } from "../redux/storySlice";

const Feed = () => {
  const dispatch = useDispatch();

  const { posts, isLoading, isFetchingMore, hasMore } = useSelector(
    (state) => state.post,
  );

  const { stories, isLoading: storiesLoading } = useSelector(
    (state) => state.story,
  );

  const { userData } = useSelector((state) => state.user);

  const observer = useRef(null);

  /* ----------------------------
      Initial Data Load
  ---------------------------- */

  useEffect(() => {
    dispatch(fetchPostsIfNeeded({ ttlMs: 30000 }));
    dispatch(fetchStoriesIfNeeded());
  }, [dispatch]);

  /* ----------------------------
      Infinite Scroll
  ---------------------------- */

  const lastPostRef = useCallback(
    (node) => {
      if (isLoading || isFetchingMore || !hasMore) return;

      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            dispatch(fetchMorePosts());
          }
        },
        {
          threshold: 0.1,
          rootMargin: "120px",
        },
      );

      if (node) observer.current.observe(node);
    },
    [dispatch, hasMore, isFetchingMore, isLoading],
  );

  /* ----------------------------
      Cleanup Observer
  ---------------------------- */

  useEffect(() => {
    return () => observer.current?.disconnect();
  }, []);

  return (
    <div className="w-full sm:ml-18 md:w-[calc(70%-72px)] lg:ml-60 lg:w-[calc(70%-240px)] sm:px-3 lg:px-4 min-h-screen bg-bg text-text-primary overflow-y-auto border-gray-700 relative">
      {/* Mobile Header */}

      <div className="flex mx-6 sm:hidden justify-between items-center h-14">
        <div className="flex">
          <img src="/logo.png" alt="Logo" className="h-8 w-8 sm:h-10 sm:w-10" />
          <span className="text-primary text-2xl sm:text-3xl font-bold">
            ynox
          </span>
        </div>

        <CiHeart className="text-4xl" />
      </div>

      {/* ----------------------------
           Stories Section
      ---------------------------- */}

      <div className="flex items-center gap-3 py-3 overflow-x-auto px-2">
        <StoryCard
          profileImage={userData?.profileImage}
          userName="Your Story"
          ownStory
          hasStory={!!userData?.story}
          username={userData?.username}
          storyId={userData?.story}
        />

        {storiesLoading ? (
          <Loader />
        ) : stories?.length ? (
          stories
            .filter((story) => story.author?._id !== userData?._id)
            .map((story) => {
              const viewed = story.viewers?.some((v) =>
                typeof v === "string"
                  ? v === userData?._id
                  : v._id === userData?._id,
              );

              return (
                <StoryCard
                  key={story._id}
                  profileImage={story.author?.profileImage}
                  userName={story.author?.username || story.author?.name}
                  username={story.author?.username}
                  storyId={story._id}
                  hasStory
                  isViewed={viewed}
                />
              );
            })
        ) : (
          <Empty message="No stories yet" />
        )}
      </div>

      {/* ----------------------------
           Posts Section
      ---------------------------- */}

      <div className="mt-4">
        {isLoading ? (
          <Loader size="10" />
        ) : posts.length ? (
          posts.map((post, index) => {
            const isLast = index === posts.length - 1;

            return (
              <div key={post._id} ref={isLast ? lastPostRef : null}>
                <Post post={post} />
              </div>
            );
          })
        ) : (
          <Empty message="No posts yet. Be the first to share!" />
        )}

        {isFetchingMore && <Loader size="8" />}
      </div>

      <div className="w-full flex justify-center">
        <Navbar />
      </div>
    </div>
  );
};

/* ----------------------------
    Reusable Components
---------------------------- */

const Loader = ({ size = "8" }) => (
  <div className="flex justify-center items-center py-6">
    <div
      className={`animate-spin rounded-full h-${size} w-${size} border-b-2 border-purple-500`}
    />
  </div>
);

const Empty = ({ message }) => (
  <div className="text-center py-10 text-text-secondary">{message}</div>
);

export default Feed;
