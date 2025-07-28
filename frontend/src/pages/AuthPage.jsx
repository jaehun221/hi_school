import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext'; // useAuth 훅 임포트
// ⭐ 수정: getEmailByUsername 및 getUsernameByEmail 함수 임포트
import { getEmailByUsername, getUsernameByEmail } from '../services/authService';

function AuthPage() {
    // ⭐ 수정: isSignupMode 초기값을 true로 변경하여 회원가입 폼이 먼저 보이도록 함
    const [isLoginMode, setIsLoginMode] = useState(true); // 로그인/회원가입 모드 전환 (true: 로그인, false: 회원가입)

    // 입력 필드 상태 관리
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [nickname, setNickname] = useState('');
    const [usernameInput, setUsernameInput] = useState(''); // ⭐ 추가: 회원가입 시 사용할 아이디(username) 상태
    const [loginIdOrEmail, setLoginIdOrEmail] = useState(''); // ⭐ 추가: 로그인 시 사용할 아이디 또는 이메일 상태

    // 메시지 표시 상태 관리
    const [message, setMessage] = useState({ text: '', type: '' });

    // 아이디 찾기 관련 상태
    const [findUsernameEmail, setFindUsernameEmail] = useState('');
    const [foundUsername, setFoundUsername] = useState('');
    const [findUsernameError, setFindUsernameError] = useState('');

    // AuthContext에서 함수와 상태 가져오기
    const { signup, login, currentUser, logout } = useAuth();

    // 메시지를 설정하고 일정 시간 후 지우는 함수
    const showMessage = (text, type = 'info', duration = 5000) => {
        setMessage({ text, type });
        setTimeout(() => {
            setMessage({ text: '', type: '' });
        }, duration);
    };

    // 회원가입 제출 핸들러
    const handleSignup = async (e) => {
        e.preventDefault(); // 폼 제출 시 페이지 새로고침 방지
        showMessage('회원가입 요청 중...', 'info');

        try {
            // ⭐ usernameInput 값을 signup 함수에 전달
            const result = await signup(email, password, nickname, usernameInput);
            showMessage(result.message, 'success');
            // 회원가입 성공 후 입력 필드 초기화
            setEmail('');
            setPassword('');
            setNickname('');
            setUsernameInput('');
            setIsLoginMode(true); // 회원가입 성공 후 로그인 모드로 전환
        } catch (error) {
            console.error('회원가입 오류:', error);
            let errorMessage = error.message || '알 수 없는 오류가 발생했습니다.';
            showMessage(`오류: ${errorMessage}`, 'error');
        }
    };

    // 로그인 제출 핸들러
    const handleLogin = async (e) => {
        e.preventDefault(); // 폼 제출 시 페이지 새로고침 방지
        showMessage('로그인 요청 중...', 'info');

        try {
            let actualEmail;
            // 사용자가 입력한 값이 이메일 형식인지 아이디 형식인지 판단
            if (loginIdOrEmail.includes('@')) {
                actualEmail = loginIdOrEmail; // 이메일로 간주
            } else {
                // 아이디(username)로 간주하고 백엔드에서 이메일 조회
                const response = await getEmailByUsername(loginIdOrEmail);
                if (response.success) {
                    actualEmail = response.data; // 백엔드에서 받은 실제 이메일로 업데이트
                    console.log(`아이디 '${loginIdOrEmail}'에 해당하는 이메일: ${actualEmail}`);
                } else {
                    throw new Error(response.message || '아이디로 이메일 조회 실패');
                }
            }

            // Firebase 로그인 (실제 이메일과 비밀번호 사용)
            const result = await login(actualEmail, password);
            showMessage(result.message, 'success');
            // 로그인 성공 후 입력 필드 초기화
            setLoginIdOrEmail('');
            setPassword('');
        } catch (error) {
            console.error('로그인 오류:', error);
            let errorMessage = error.message || '알 수 없는 오류가 발생했습니다.';
            showMessage(`오류: ${errorMessage}`, 'error');
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

    // 아이디 찾기 핸들러
    const handleFindUsername = async (e) => {
        e.preventDefault();
        setFoundUsername(''); // 이전 결과 초기화
        setFindUsernameError(''); // 이전 에러 초기화
        showMessage('아이디 찾는 중...', 'info');

        try {
            const response = await getUsernameByEmail(findUsernameEmail); // 백엔드 API 호출
            if (response.success) {
                setFoundUsername(`찾으시는 아이디는: ${response.data} 입니다.`);
                showMessage('아이디를 성공적으로 찾았습니다!', 'success');
            } else {
                setFindUsernameError(response.message || '아이디를 찾을 수 없습니다.');
                showMessage(`아이디 찾기 실패: ${response.message || '알 수 없는 오류'}`, 'error');
            }
        } catch (error) {
            console.error('아이디 찾기 오류:', error);
            setFindUsernameError(`아이디 찾기 오류: ${error.message || '알 수 없는 오류'}`);
            showMessage(`아이디 찾기 오류: ${error.message || '알 수 없는 오류'}`, 'error');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-200 p-4 sm:px-8 lg:px-16">
            <div className="bg-white p-8 sm:p-10 rounded-2xl shadow-2xl w-full max-w-sm transform transition-all duration-300 hover:scale-[1.01] border border-indigo-300">
                <h2 className="text-4xl font-extrabold text-center text-gray-900 mb-8 tracking-tight">
                    {isLoginMode ? '로그인' : '회원가입'}
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
                    <form onSubmit={isLoginMode ? handleLogin : handleSignup} className="space-y-6">
                        {!isLoginMode ? ( // 회원가입 모드
                            <>
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">이메일</label>
                                    <input
                                        type="email"
                                        id="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        placeholder="example@email.com"
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="nickname" className="block text-sm font-medium text-gray-700 mb-1">닉네임</label>
                                    <input
                                        type="text"
                                        id="nickname"
                                        value={nickname}
                                        onChange={(e) => setNickname(e.target.value)}
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        placeholder="사용할 닉네임"
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="usernameInput" className="block text-sm font-medium text-gray-700 mb-1">아이디</label>
                                    <input
                                        type="text"
                                        id="usernameInput"
                                        value={usernameInput}
                                        onChange={(e) => setUsernameInput(e.target.value)}
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        placeholder="로그인할 아이디 (4~15자)"
                                        required
                                    />
                                </div>
                            </>
                        ) : ( // 로그인 모드
                            <div>
                                <label htmlFor="loginIdOrEmail" className="block text-sm font-medium text-gray-700 mb-1">아이디 또는 이메일</label>
                                <input
                                    type="text"
                                    id="loginIdOrEmail"
                                    value={loginIdOrEmail}
                                    onChange={(e) => setLoginIdOrEmail(e.target.value)}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    placeholder="아이디 또는 이메일"
                                    required
                                />
                            </div>
                        )}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">비밀번호</label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                placeholder="비밀번호를 입력하세요"
                                required
                            />  
                        </div>
                        <button
                            type="submit"
                            className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-base font-semibold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-300"
                        >
                            {isLoginMode ? '로그인' : '회원가입'}
                        </button>
                    </form>
                )}

                <button
                    onClick={() => {
                        setIsLoginMode(!isLoginMode);
                        // 모드 전환 시 모든 입력 필드 및 메시지 초기화
                        setEmail('');
                        setPassword('');
                        setNickname('');
                        setUsernameInput('');
                        setLoginIdOrEmail('');
                        setMessage({ text: '', type: '' });
                        setFoundUsername('');
                        setFindUsernameError('');
                        setFindUsernameEmail('');
                    }}
                    className="mt-6 w-full text-indigo-700 text-base font-medium hover:underline hover:text-indigo-900 transition duration-200"
                >
                    {isLoginMode ? '계정이 없으신가요? 회원가입' : '이미 계정이 있으신가요? 로그인'}
                </button>

                {message.text && (
                    <div className={`mt-6 p-4 rounded-lg text-base font-medium shadow-md ${
                        message.type === 'success' ? 'bg-green-100 text-green-800 border border-green-300' :
                        message.type === 'error' ? 'bg-red-100 text-red-800 border border-red-300' :
                        'bg-blue-100 text-blue-800 border border-blue-300'
                    }`}>
                        {message.text}
                    </div>
                )}

                {/* ⭐ 추가: 아이디 찾기 섹션 */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                    <h3 className="text-2xl font-bold mb-4 text-center text-gray-800">아이디 찾기</h3>
                    <form onSubmit={handleFindUsername} className="space-y-4">
                        <div>
                            <label htmlFor="findUsernameEmail" className="block text-sm font-medium text-gray-700 mb-1">
                                가입 시 사용한 이메일
                            </label>
                            <input
                                type="email"
                                id="findUsernameEmail"
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                value={findUsernameEmail}
                                onChange={(e) => setFindUsernameEmail(e.target.value)}
                                placeholder="example@email.com"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-base font-semibold text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition duration-300"
                        >
                            아이디 찾기
                        </button>
                    </form>
                    {foundUsername && (
                        <div className="mt-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-md text-sm">
                            {foundUsername}
                        </div>
                    )}
                    {findUsernameError && (
                        <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md text-sm">
                            {findUsernameError}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default AuthPage;
