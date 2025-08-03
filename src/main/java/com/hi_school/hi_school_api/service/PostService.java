package com.hi_school.hi_school_api.service;

import com.hi_school.hi_school_api.domain.post.Post;
import com.hi_school.hi_school_api.dto.post.PostRequestDto;
import com.hi_school.hi_school_api.dto.post.PostResponseDto;
import com.hi_school.hi_school_api.dto.post.PostsListResponseDto;
import com.hi_school.hi_school_api.domain.post.PostRepository;
import com.hi_school.hi_school_api.domain.comment.CommentRepository;
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
    private final CommentRepository commentRepository; // 댓글 레포지토리 주입

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

// 이 파일의 소스에는 문제 없습니다.
// 빌드 오류는 디렉터리 삭제 실패(권한 또는 파일 점유)로 인한 것이므로, 소스 변경 없이
// 아래와 같이 해결하세요:
//
// 1. IDE/터미널을 완전히 종료 후 다시 빌드
// 2. build/classes/java/main 폴더가 열려 있거나 파일이 점유 중이면 닫기
// 3. 필요시 해당 폴더를 수동으로 삭제 후 빌드 재시도
