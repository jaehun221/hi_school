// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../firebase/firebaseConfig'; // Firebase auth 인스턴스 임포트

// ⭐ 중요: 이 라인을 정확히 확인하고 수정하세요.
// createUserWithEmailAndPassword와 signInWithEmailAndPassword를 firebase/auth에서 임포트해야 합니다.
import { onAuthStateChanged, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';

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
            // 1. Firebase Authentication에 사용자 생성
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const firebaseUser = userCredential.user;

            // 2. 백엔드 API에 회원가입 정보 전송
            const backendResponse = await signupUser(email, password, nickname);

            if (backendResponse.success) {
                return { success: true, message: backendResponse.message, user: firebaseUser };
            } else {
                // 백엔드 저장 실패 시 Firebase 사용자 롤백 (선택 사항)
                await firebaseUser.delete();
                throw new Error(backendResponse.message || '백엔드 회원가입 실패');
            }
        } catch (error) {
            console.error('회원가입 오류:', error);
            throw error;
        }
    };

    // 로그인 함수
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

    // 로그아웃 함수
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
