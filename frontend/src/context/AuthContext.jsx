import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../firebase/firebaseConfig'; // Firebase auth 인스턴스 임포트

// ⭐ 중요: 이 라인을 정확히 확인하고 수정하세요.
// createUserWithEmailAndPassword와 signInWithEmailAndPassword를 firebase/auth에서 임포트해야 합니다.
import { onAuthStateChanged, signOut, signInWithEmailAndPassword } from 'firebase/auth'; // createUserWithEmailAndPassword 제거

import { signupUser, signinUser } from '../services/authService'; // 백엔드 서비스 임포트

// AuthContext 생성
const AuthContext = createContext();

// AuthContext를 사용하기 위한 커스텀 훅
export const useAuth = () => {
    return useContext(AuthContext);
};

// AuthProvider 컴포넌트: 인증 상태를 관리하고 하위 컴포넌트에 제공
export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null); // Firebase에서 현재 로그인된 사용자
    const [loading, setLoading] = useState(true); // 초기 로딩 상태

    // Firebase 인증 상태 변화 감지
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            setCurrentUser(user); // Firebase 사용자 객체 설정
            setLoading(false); // 로딩 완료
        });

        // 컴포넌트 언마운트 시 리스너 해제
        return unsubscribe;
    }, []);

    // 회원가입 함수
    const signup = async (email, password, nickname) => {
        try {
            // 1. 백엔드 API에 회원가입 정보 전송
            // Firebase 사용자 생성 및 로컬 DB 저장 모두 백엔드에서 처리
            const backendResponse = await signupUser(email, password, nickname);

            if (backendResponse.success) {
                // 백엔드에서 사용자 생성 및 DB 저장이 성공했으므로,
                // 이제 Firebase SDK를 통해 해당 계정으로 로그인 시도
                const userCredential = await signInWithEmailAndPassword(auth, email, password);
                const firebaseUser = userCredential.user;

                return { success: true, message: backendResponse.message, user: firebaseUser };
            } else {
                // 백엔드에서 실패한 경우
                throw new Error(backendResponse.message || '백엔드 회원가입 실패');
            }
        } catch (error) {
            console.error('회원가입 오류:', error);
            // Firebase Authentication 오류 코드 처리
            // 백엔드에서 넘어오는 에러 메시지에 'EMAIL_EXISTS'가 포함되어 있다면,
            // 더 구체적인 메시지를 사용자에게 보여줄 수 있습니다.
            if (error.message && error.message.includes('EMAIL_EXISTS')) {
                throw new Error('이미 가입된 이메일입니다. 로그인해주세요.');
            }
            throw error;
        }
    };

    // 로그인 함수 (기존과 동일)
    const login = async (email, password) => {
        try {
            // 1. Firebase Authentication으로 로그인
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const firebaseUser = userCredential.user;

            // 2. Firebase ID Token 획득
            const idToken = await firebaseUser.getIdToken();

            // 3. 백엔드 API에 ID Token 전송하여 로그인 처리
            const backendResponse = await signinUser(idToken);

            if (backendResponse.success) {
                return { success: true, message: backendResponse.message, user: firebaseUser };
            } else {
                throw new Error(backendResponse.message || '백엔드 로그인 실패');
            }
        } catch (error) {
            console.error('로그인 오류:', error);
            throw error;
        }
    };

    // 로그아웃 함수 (기존과 동일)
    const logout = async () => {
        try {
            await signOut(auth); // Firebase 로그아웃
            // 필요한 경우 백엔드 로그아웃 API 호출 (세션 기반이 아니라면 불필요)
            return { success: true, message: '로그아웃 성공' };
        } catch (error) {
            console.error('로그아웃 오류:', error);
            throw error;
        }
    };

    // Context가 제공할 값들
    const value = {
        currentUser,
        loading,
        signup,
        login,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children} {/* 로딩이 끝나면 자식 컴포넌트 렌더링 */}
        </AuthContext.Provider>
    );
};