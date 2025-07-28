package com.hi_school.hi_school_api.service;

import com.hi_school.hi_school_api.domain.post.Post;
import com.hi_school.hi_school_api.dto.post.PostRequestDto;
import com.hi_school.hi_school_api.dto.post.PostResponseDto;
import com.hi_school.hi_school_api.dto.post.PostsListResponseDto;
import com.hi_school.hi_school_api.domain.post.PostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;

import java.time.LocalDateTime;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PostService {

    private final PostRepository postRepository;

    public Long createPost(PostRequestDto dto) {
        Post post = Post.builder()
                .title(dto.getTitle())
                .content(dto.getContent())
                .author(dto.getAuthor())
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
        return postRepository.save(post).getId();
    }

    public PostResponseDto getPost(Long id) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        return new PostResponseDto(post);
    }

    // 게시글 목록 조회(페이지네이션)
    public PostsListResponseDto getPosts(int page, int size) {
        PageRequest pageRequest = PageRequest.of(page - 1, size, Sort.by("createdAt").descending());
        Page<Post> postPage = postRepository.findAll(pageRequest);

        java.util.List<PostResponseDto> posts = postPage.getContent().stream()
                .map(PostResponseDto::new)
                .collect(Collectors.toList());

        return new PostsListResponseDto(
                posts,
                postPage.getTotalPages(),
                postPage.getTotalElements()
        );
    }

    public void updatePost(Long id, PostRequestDto dto) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        post.setTitle(dto.getTitle());
        post.setContent(dto.getContent());
        post.setUpdatedAt(LocalDateTime.now());
        postRepository.save(post);
    }

    public void deletePost(Long id) {
        postRepository.deleteById(id);
    }
}
