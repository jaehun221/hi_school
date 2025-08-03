package com.hi_school.hi_school_api.controller;

import com.hi_school.hi_school_api.dto.comment.CommentRequestDto;
import com.hi_school.hi_school_api.dto.comment.CommentResponseDto;
import com.hi_school.hi_school_api.service.CommentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/posts/{postId}/comments")
@RequiredArgsConstructor
public class CommentController {

    private final CommentService commentService;

    @PostMapping
    public ResponseEntity<Long> createComment(@PathVariable Long postId, @RequestBody @Valid CommentRequestDto dto) {
        return ResponseEntity.ok(commentService.createComment(postId, dto));
    }

    @GetMapping
    public ResponseEntity<List<CommentResponseDto>> getComments(@PathVariable Long postId) {
        return ResponseEntity.ok(commentService.getComments(postId));
    }

    @PutMapping("/{commentId}")
    public ResponseEntity<Void> updateComment(@PathVariable Long postId,
                                              @PathVariable Long commentId,
                                              @RequestBody @Valid CommentRequestDto dto) {
        commentService.updateComment(postId, commentId, dto);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{commentId}")
    public ResponseEntity<Void> deleteComment(@PathVariable Long commentId) {
        commentService.deleteComment(commentId);
        return ResponseEntity.ok().build();
    }
}
