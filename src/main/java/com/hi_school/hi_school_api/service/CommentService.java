package com.hi_school.hi_school_api.service;

import com.hi_school.hi_school_api.domain.comment.Comment;
import com.hi_school.hi_school_api.domain.comment.CommentRepository;
import com.hi_school.hi_school_api.domain.post.Post;
import com.hi_school.hi_school_api.domain.post.PostRepository;
import com.hi_school.hi_school_api.dto.comment.CommentRequestDto;
import com.hi_school.hi_school_api.dto.comment.CommentResponseDto;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class CommentService {

    private final CommentRepository commentRepository;
    private final PostRepository postRepository;

    public Long createComment(Long postId, CommentRequestDto dto) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        Comment parent = null;
        if (dto.getParentId() != null) {
            parent = commentRepository.findById(dto.getParentId())
                    .orElseThrow(() -> new RuntimeException("Parent comment not found"));
        }

        Comment comment = Comment.builder()
                .author(dto.getAuthor())
                .authorUid(dto.getAuthorUid())
                .authorNickname(dto.getAuthorNickname())
                .content(dto.getContent())
                .post(post)
                .parent(parent)
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
        if (dto.getAuthor() != null) comment.setAuthor(dto.getAuthor());
        if (dto.getAuthorUid() != null) comment.setAuthorUid(dto.getAuthorUid());
        if (dto.getAuthorNickname() != null) comment.setAuthorNickname(dto.getAuthorNickname());
        comment.setContent(dto.getContent());
    }

    @Transactional(readOnly = true)
    public List<CommentResponseDto> getComments(Long postId) {
        List<Comment> topLevelComments = commentRepository.findByPostIdAndParentIsNull(postId);
        return topLevelComments.stream()
                .map(this::convertToDtoTree)
                .collect(Collectors.toList());
    }

    private CommentResponseDto convertToDtoTree(Comment comment) {
        List<CommentResponseDto> childrenDtos = comment.getChildren().stream()
                .map(this::convertToDtoTree)
                .collect(Collectors.toList());

        return new CommentResponseDto(
                comment.getId(),
                comment.getAuthor(),
                comment.getAuthorUid(),
                comment.getAuthorNickname(),
                comment.getContent(),
                comment.getCreatedAt(),
                comment.getUpdatedAt(),
                comment.getParent() != null ? comment.getParent().getId() : null,
                childrenDtos
        );
    }


    public void deleteComment(Long commentId) {
        commentRepository.deleteById(commentId);
    }
}
