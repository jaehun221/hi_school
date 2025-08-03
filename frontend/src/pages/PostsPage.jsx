import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
// 예시로 fetchPosts는 서비스 함수라고 가정

function PostsPage() {
  const [posts, setPosts] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  // 페이지 번호를 쿼리스트링에서 가져옴, 기본값 1
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get('page')) || 1;

  useEffect(() => {
    setLoading(true);
    // fetchPosts(page, 20) 이런 식으로 백엔드 호출
    fetch(`/api/posts?page=${page}&size=20`)
      .then(res => res.json())
      .then(data => {
        setPosts(data.posts);
        setTotalPages(data.totalPages); // totalPages는 백엔드에서 내려줘야 함
        setLoading(false);
      });
  }, [page]);

  if (loading) return <div>로딩 중...</div>;

  return (
    <div>
      <h2>전체 게시글</h2>
      <ul>
        {posts.map(post => (
          <li key={post.id}>
            <Link to={`/posts/${post.id}`}>{post.title}</Link>
          </li>
        ))}
      </ul>
      <div style={{marginTop: '16px'}}>
        {Array.from({length: totalPages}, (_, i) => (
          <button
            key={i+1}
            onClick={() => setSearchParams({ page: i+1 })}
            style={{margin: 2, fontWeight: page === (i+1) ? 'bold' : 'normal'}}
          >
            {i+1}
          </button>
        ))}
      </div>
    </div>
  );
}

export default PostsPage;
