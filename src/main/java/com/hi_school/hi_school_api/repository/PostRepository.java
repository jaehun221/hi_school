package com.hi_school.hi_school_api.repository;

import com.hi_school.hi_school_api.domain.post.Post;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PostRepository extends JpaRepository<Post, Long> {
}
