package com.hi_school.hi_school_api.service;

import com.hi_school.hi_school_api.domain.comment.Comment;
import com.hi_school.hi_school_api.domain.comment.CommentRepository;
import com.hi_school.hi_school_api.domain.post.Post;
import com.hi_school.hi_school_api.repository.PostRepository;
import com.hi_school.hi_school_api.dto.comment.CommentRequestDto;
import com.hi_school.hi_school_api.dto.comment.CommentResponseDto;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CommentService {

    private final CommentRepository commentRepository;
    private final PostRepository postRepository;

    public Long createComment(Long postId, CommentRequestDto dto) {
        Post post = postRepository.findById(postId).orElseThrow(() -> new RuntimeException("Post not found"));

        Comment comment = Comment.builder()
                .author(dto.getAuthor())
                .content(dto.getContent())
                .post(post)
                .build();

        return commentRepository.save(comment).getId();
    }

    @Transactional
    public void updateComment(Long postId, Long commentId, CommentRequestDto dto) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new EntityNotFoundException("댓글을 찾을 수 없습니다."));
        if (!comment.getPost().getId().equals(postId)) {
            throw new IllegalArgumentException("댓글이 해당 게시글에 속하지 않습니다.");
        }
        comment.setAuthor(dto.getAuthor());
        comment.setContent(dto.getContent());
    }

    public List<CommentResponseDto> getComments(Long postId) {
        return commentRepository.findByPostId(postId)
                .stream()
                .map(c -> new CommentResponseDto(c.getId(), c.getAuthor(), c.getContent(), c.getCreatedAt(), c.getUpdatedAt()))
                .collect(Collectors.toList());
    }

    public void deleteComment(Long commentId) {
        commentRepository.deleteById(commentId);
    }
}
