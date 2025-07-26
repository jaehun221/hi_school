import React, { useState } from 'react';
import AuthForm from '../components/AuthForm'; // AuthForm 컴포넌트 임포트
import { useAuth } from '../context/AuthContext'; // useAuth 훅 임포트

function AuthPage() {
    const [isSignupMode, setIsSignupMode] = useState(true); // 회원가입/로그인 모드 전환
    const [message, setMessage] = useState({ text: '', type: '' }); // 메시지 표시
    const { signup, login, currentUser, logout } = useAuth(); // AuthContext에서 함수와 상태 가져오기

    // 메시지를 설정하고 일정 시간 후 지우는 함수
    const showMessage = (text, type = 'info', duration = 5000) => {
        setMessage({ text, type });
        setTimeout(() => {
            setMessage({ text: '', type: '' });
        }, duration);
    };

    // AuthForm 제출 핸들러
    const handleSubmit = async ({ email, password, nickname }) => {
        try {
            if (isSignupMode) {
                // 회원가입 모드
                const result = await signup(email, password, nickname);
                showMessage(result.message, 'success');
            } else {
                // 로그인 모드
                const result = await login(email, password);
                showMessage(result.message, 'success');
            }
        } catch (error) {
            console.error('인증 처리 오류:', error);
            showMessage(`오류: ${error.message || '알 수 없는 오류가 발생했습니다.'}`, 'error');
        }
    };

    // 로그아웃 핸들러
    const handleLogout = async () => {
        try {
            const result = await logout();
            showMessage(result.message, 'success');
        } catch (error) {
            console.error('로그아웃 오류:', error);
            showMessage(`로그아웃 오류: ${error.message || '알 수 없는 오류가 발생했습니다.'}`, 'error');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            <div className="bg-white p-10 rounded-xl shadow-xl w-full max-w-md">
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
                    {isSignupMode ? '회원가입' : '로그인'}
                </h2>

                {/* 현재 로그인된 사용자 정보 표시 */}
                {currentUser && (
                    <div className="bg-blue-50 border border-blue-200 text-blue-800 p-3 rounded-lg mb-6 text-sm">
                        <p className="font-semibold">로그인됨:</p>
                        <p>이메일: {currentUser.email}</p>
                        <p>UID: {currentUser.uid}</p>
                        <button
                            onClick={handleLogout}
                            className="mt-3 w-full bg-red-500 text-white py-2 px-4 rounded-md text-sm font-semibold hover:bg-red-600 transition duration-300"
                        >
                            로그아웃
                        </button>
                    </div>
                )}

                {/* 로그인/회원가입 폼 */}
                {!currentUser && ( // 로그인되지 않았을 때만 폼 표시
                    <>
                        <AuthForm onSubmit={handleSubmit} isSignup={isSignupMode} />
                        <button
                            onClick={() => setIsSignupMode(!isSignupMode)}
                            className="mt-4 w-full text-indigo-600 text-sm hover:underline"
                        >
                            {isSignupMode ? '이미 계정이 있으신가요? 로그인' : '계정이 없으신가요? 회원가입'}
                        </button>
                    </>
                )}

                {/* 메시지 표시 영역 */}
                {message.text && (
                    <div className={`mt-6 p-4 rounded-lg text-sm ${
                        message.type === 'success' ? 'bg-green-100 text-green-800' :
                        message.type === 'error' ? 'bg-red-100 text-red-800' :
                        'bg-blue-100 text-blue-800'
                    }`}>
                        {message.text}
                    </div>
                )}
            </div>
        </div>
    );
}

export default AuthPage;