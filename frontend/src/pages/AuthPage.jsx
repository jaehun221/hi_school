import React, { useState } from 'react';
import AuthForm from '../components/AuthForm'; // AuthForm 컴포넌트 임포트 (확장자 생략)
import { useAuth } from '../context/AuthContext'; // useAuth 훅 임포트 (확장자 생략)

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
            // 에러 메시지를 사용자에게 더 친화적으로 표시
            let errorMessage = '알 수 없는 오류가 발생했습니다.';
            if (error.message) {
                errorMessage = error.message;
            } else if (error.response && error.response.data && error.response.data.message) {
                // 백엔드에서 넘어오는 API 응답의 에러 메시지 처리
                errorMessage = error.response.data.message;
            }
            showMessage('오류: ' + errorMessage, 'error');
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
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-200 p-4 sm:px-8 lg:px-16">
            <div className="bg-white p-8 sm:p-10 rounded-2xl shadow-2xl w-full max-w-sm transform transition-all duration-300 hover:scale-[1.01] border border-indigo-300">
                <h2 className="text-4xl font-extrabold text-center text-gray-900 mb-8 tracking-tight">
                    {isSignupMode ? '회원가입' : '로그인'}
                </h2>

                {currentUser && (
                    <div className="bg-blue-50 border border-blue-200 text-blue-800 p-4 rounded-lg mb-6 text-sm shadow-inner">
                        <p className="font-bold text-base mb-2">로그인됨:</p>
                        <p className="mb-1">이메일: <span className="font-medium">{currentUser.email}</span></p>
                        <p className="mb-3">UID: <span className="font-medium break-all">{currentUser.uid}</span></p>
                        <button
                            onClick={handleLogout}
                            className="mt-3 w-full bg-red-500 text-white py-2.5 px-4 rounded-md text-base font-semibold hover:bg-red-600 transition duration-300 shadow-md"
                        >
                            로그아웃
                        </button>
                    </div>
                )}

                {!currentUser && (
                    <>
                        <AuthForm onSubmit={handleSubmit} isSignup={isSignupMode} />
                        <button
                            onClick={() => setIsSignupMode(!isSignupMode)}
                            className="mt-6 w-full text-indigo-700 text-base font-medium hover:underline hover:text-indigo-900 transition duration-200"
                        >
                            {isSignupMode ? '이미 계정이 있으신가요? 로그인' : '계정이 없으신가요? 회원가입'}
                        </button>
                    </>
                )}

                {message.text && (
                    <div className={`mt-6 p-4 rounded-lg text-base font-medium shadow-md ${
                        message.type === 'success' ? 'bg-green-100 text-green-800 border border-green-300' :
                        message.type === 'error' ? 'bg-red-100 text-red-800 border border-red-300' :
                        'bg-blue-100 text-blue-800 border border-blue-300'
                    }`}>
                        {message.text}
                    </div>
                )}
            </div>
        </div>
    );
}

export default AuthPage;
