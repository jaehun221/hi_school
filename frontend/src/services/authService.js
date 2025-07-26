// 백엔드 API의 기본 URL 설정
const BACKEND_BASE_URL = 'http://localhost:8090'; // 개발 환경용. 배포 시 실제 서버 URL로 변경 필요

// 회원가입 API 호출 함수
export const signupUser = async (email, password, nickname) => {
    try {
        const response = await fetch(`${BACKEND_BASE_URL}/api/auth/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password, nickname })
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
