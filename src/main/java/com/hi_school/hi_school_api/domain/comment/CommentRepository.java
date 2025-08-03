package com.hi_school.hi_school_api.domain.comment;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Long> {
    List<Comment> findByPostId(Long postId);
    List<Comment> findByPostIdAndParentIsNull(Long postId); // 최상위 댓글
    List<Comment> findByParentId(Long parentId); // 특정 댓글의 대댓글
}
