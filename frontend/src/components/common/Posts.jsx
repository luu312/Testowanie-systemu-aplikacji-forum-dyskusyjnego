import React, { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import Post from "./Post";
import PostSkeleton from "../skeletons/PostSkeleton";
import { useCategory } from "../../context/CategoryContext";

const Posts = ({ feedType, username, userId }) => {
  const { selectedCategory } = useCategory();

  const getPostEndpoint = () => {
    switch (feedType) {
      case "following":
        return selectedCategory
          ? `/api/post/following/${selectedCategory}`
          : "/api/post/following";

      case "posts":
        return selectedCategory
          ? `/api/post/user/${username}/${selectedCategory}`
          : `/api/post/user/${username}`;

      case "likes":
        return selectedCategory
          ? `/api/post/likes/${userId}/${selectedCategory}`
          : `/api/post/likes/${userId}`;

      case "forYou":
      default:
        return selectedCategory ? `/api/post/${selectedCategory}` : "/api/post/all";
    }
  };

  const POST_ENDPOINT = getPostEndpoint();

  const { data: posts, isLoading, refetch, isRefetching, error } = useQuery({
    queryKey: ["posts", feedType, selectedCategory, username, userId],
    queryFn: async () => {
      try {
        const res = await fetch(POST_ENDPOINT);
        if (res.status === 404) {
          return [];
        }
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }
        return data;
      } catch (error) {
        throw error;
      }
    },
  });

  useEffect(() => {
    refetch();
  }, [feedType, selectedCategory, username, userId, refetch]);

  return (
    <div>
      <div className="p-4">
        {(isLoading || isRefetching) && (
          <div className="flex flex-col justify-center">
            <PostSkeleton />
            <PostSkeleton />
            <PostSkeleton />
          </div>
        )}
        {!isLoading && !isRefetching && (posts?.length === 0 || error) && (
          <p className="text-center my-4">No posts in this tab.</p>
        )}
        {!isLoading && !isRefetching && posts && posts.length > 0 && (
          <div className="flex flex-col gap-4">
            {posts.map((post) => (
              <Post key={post._id} post={post} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Posts;