import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import Modal from "../modal/Modal";
import SectionLoader from "../loader/SectionLoader";
import BlogCard from "../cards/BlogCard";
import { deleteBlog } from "../../hooks/blogs/deleteBlog";
import type { blogData } from "../../types/blogs/blogDataTypes";

interface ParentProps {
  blogs: blogData[];
  isLoading: boolean;
}

const BlogsParent = ({ blogs, isLoading }: ParentProps) => {
  const queryClient = useQueryClient();
  const [modal, showModal] = useState(false);

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteBlog(id),
    onSuccess: () => {
      showModal(true);
      queryClient.invalidateQueries({ queryKey: ["blogs"], exact: false });
    },
    onError: () => {
      showModal(true);
    },
  });

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this blog?")) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) return <SectionLoader />;

  return (
    <>
      {blogs && blogs.length > 0 ? (
        <div className="w-full lg:w-9/10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ">
          {blogs.map((blog: blogData) => (
            <BlogCard
              key={blog._id}
              images={blog.images}
              _id={blog._id}
              title={blog.title}
              tags={blog.tags}
              contents={blog.contents}
              status={blog.status}
              onDelete={() => {
                handleDelete(blog._id);
              }}
              readingTimeUnit={blog.readingTimeUnit}
              readingTimeValue={blog.readingTimeValue}
              relatedLinks={blog.relatedLinks}
            />
          ))}
        </div>
      ) : (
        <div className="h-[60vh] flex items-center justify-center">
          <p className="text-sm font-normal">No Results Found</p>
        </div>
      )}
      {modal && (
        <Modal
          success={deleteMutation.isError ? false : true}
          message={
            deleteMutation.isError
              ? deleteMutation.error.message
              : deleteMutation.data
          }
          action={() => showModal(false)}
        />
      )}
    </>
  );
};

export default BlogsParent;
