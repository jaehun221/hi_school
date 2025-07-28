// 백엔드 API의 기본 URL 설정
const BACKEND_BASE_URL = 'http://localhost:8090'; // 개발 환경용. 배포 시 실제 서버 URL로 변경 필요

// 회원가입 API 호출 함수
// ⭐ 수정: username 파라미터 추가
export const signupUser = async (email, password, nickname, username) => {
    try {
        const response = await fetch(`${BACKEND_BASE_URL}/api/auth/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            // ⭐ 수정: username을 body에 추가
            body: JSON.stringify({ email, password, nickname, username })
        });
        const data = await response.json();
        if (!response.ok) { // HTTP 상태 코드가 2xx가 아닌 경우 에러로 처리
            throw new Error(data.message || '백엔드 회원가입 실패');
        }
        return data; // 성공 응답 반환
    } catch (error) {
        console.error('백엔드 회원가입 API 오류:', error);
        throw error; // 에러를 다시 던져 상위 컴포넌트에서 처리하도록 함
    }
};

// 로그인 API 호출 함수
export const signinUser = async (firebaseIdToken) => {
    try {
        const response = await fetch(`${BACKEND_BASE_URL}/api/auth/signin`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ firebaseIdToken })
        });
        const data = await response.json();
        if (!response.ok) { // HTTP 상태 코드가 2xx가 아닌 경우 에러로 처리
            throw new Error(data.message || '백엔드 로그인 실패');
        }
        return data; // 성공 응답 반환
    } catch (error) {
        console.error('백엔드 로그인 API 오류:', error);
        throw error; // 에러를 다시 던져 상위 컴포넌트에서 처리하도록 함
    }
};

// ⭐ 추가: 유저네임(아이디)으로 이메일 조회 함수 (로그인 과정 내부에서 사용)
// 이 함수는 백엔드의 /api/auth/email-by-username 엔드포인트를 호출합니다.
export const getEmailByUsername = async (username) => {
    try {
        // GET 요청 시 쿼리 파라미터로 데이터 전송
        const response = await fetch(`${BACKEND_BASE_URL}/api/auth/email-by-username?username=${encodeURIComponent(username)}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || '아이디로 이메일 조회 실패');
        }
        return data; // ApiResponse 객체가 반환됩니다.
    } catch (error) {
        console.error('아이디로 이메일 조회 API 오류:', error);
        throw error;
    }
};

// ⭐ 추가: 이메일로 유저네임(아이디) 조회 함수 (아이디 찾기 기능에서 사용)
// 이 함수는 백엔드의 /api/auth/username-by-email 엔드포인트를 호출합니다.
export const getUsernameByEmail = async (email) => {
    try {
        // GET 요청 시 쿼리 파라미터로 데이터 전송
        const response = await fetch(`${BACKEND_BASE_URL}/api/auth/username-by-email?email=${encodeURIComponent(email)}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || '이메일로 아이디 조회 실패');
        }
        return data; // ApiResponse 객체가 반환됩니다.
    } catch (error) {
        console.error('이메일로 아이디 조회 API 오류:', error);
        throw error;
    }
};
