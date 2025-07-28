import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getEmailByUsername, getUsernameByEmail } from '../services/authService';

function AuthPage() {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [showFindUsername, setShowFindUsername] = useState(false); // 아이디 찾기 화면 표시 여부

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [usernameInput, setUsernameInput] = useState('');
  const [loginIdOrEmail, setLoginIdOrEmail] = useState('');

  const [message, setMessage] = useState({ text: '', type: '' });

  const [findUsernameEmail, setFindUsernameEmail] = useState('');
  const [foundUsername, setFoundUsername] = useState('');
  const [findUsernameError, setFindUsernameError] = useState('');

  const { signup, login, currentUser, logout } = useAuth();

  const showMessage = (text, type = 'info', duration = 5000) => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: '' }), duration);
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    showMessage('회원가입 요청 중...', 'info');
    try {
      const result = await signup(email, password, nickname, usernameInput);
      showMessage(result.message, 'success');
      setEmail('');
      setPassword('');
      setNickname('');
      setUsernameInput('');
      setIsLoginMode(true);
    } catch (error) {
      showMessage(`오류: ${error.message || '알 수 없는 오류 발생'}`, 'error');
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    showMessage('로그인 요청 중...', 'info');
    try {
      let actualEmail = loginIdOrEmail;
      if (!loginIdOrEmail.includes('@')) {
        const response = await getEmailByUsername(loginIdOrEmail);
        if (response.success) {
          actualEmail = response.data;
        } else {
          throw new Error(response.message || '아이디로 이메일 조회 실패');
        }
      }
      const result = await login(actualEmail, password);
      showMessage(result.message, 'success');
      setLoginIdOrEmail('');
      setPassword('');
    } catch (error) {
      showMessage(`오류: ${error.message || '알 수 없는 오류 발생'}`, 'error');
    }
  };

  const handleLogout = async () => {
    try {
      const result = await logout();
      showMessage(result.message, 'success');
    } catch (error) {
      showMessage(`로그아웃 오류: ${error.message || '알 수 없는 오류'}`, 'error');
    }
  };

  const handleFindUsername = async (e) => {
    e.preventDefault();
    setFoundUsername('');
    setFindUsernameError('');
    showMessage('아이디 찾는 중...', 'info');
    try {
      const response = await getUsernameByEmail(findUsernameEmail);
      if (response.success) {
        setFoundUsername(`찾으시는 아이디는: ${response.data} 입니다.`);
        showMessage('아이디를 성공적으로 찾았습니다!', 'success');
      } else {
        setFindUsernameError(response.message || '아이디를 찾을 수 없습니다.');
        showMessage(`실패: ${response.message || '알 수 없는 오류'}`, 'error');
      }
    } catch (error) {
      setFindUsernameError(error.message || '알 수 없는 오류');
      showMessage(`오류: ${error.message || '알 수 없는 오류'}`, 'error');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-200 p-4">
      <div className="bg-white p-8 sm:p-10 rounded-2xl shadow-2xl w-full max-w-sm border border-indigo-300">
        <h2 className="text-4xl font-extrabold text-center text-gray-900 mb-8">
          {showFindUsername ? '아이디 찾기' : isLoginMode ? '로그인' : '회원가입'}
        </h2>

        {message.text && (
          <div className={`mb-6 p-4 rounded-lg text-base font-medium shadow-md ${
            message.type === 'success' ? 'bg-green-100 text-green-800 border border-green-300' :
            message.type === 'error' ? 'bg-red-100 text-red-800 border border-red-300' :
            'bg-blue-100 text-blue-800 border border-blue-300'
          }`}>
            {message.text}
          </div>
        )}

        {!currentUser && !showFindUsername && (
          <form onSubmit={isLoginMode ? handleLogin : handleSignup} className="space-y-6">
            {!isLoginMode ? (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">이메일</label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md shadow-sm sm:text-sm" placeholder="example@email.com" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">닉네임</label>
                  <input type="text" value={nickname} onChange={(e) => setNickname(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md shadow-sm sm:text-sm" placeholder="사용할 닉네임" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">아이디</label>
                  <input type="text" value={usernameInput} onChange={(e) => setUsernameInput(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md shadow-sm sm:text-sm" placeholder="로그인할 아이디 (4~15자)" required />
                </div>
              </>
            ) : (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">아이디 또는 이메일</label>
                <input type="text" value={loginIdOrEmail} onChange={(e) => setLoginIdOrEmail(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md shadow-sm sm:text-sm" placeholder="아이디 또는 이메일" required />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">비밀번호</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border rounded-md shadow-sm sm:text-sm" placeholder="비밀번호를 입력하세요" required />
            </div>
            <button type="submit" className="w-full bg-indigo-600 text-white py-2.5 rounded-md font-semibold hover:bg-indigo-700">
              {isLoginMode ? '로그인' : '회원가입'}
            </button>
            <div className="flex justify-center gap-4 text-sm pt-2">
              <button type="button" onClick={() => {
                setIsLoginMode(!isLoginMode);
                setMessage({ text: '', type: '' });
              }} className="text-indigo-700 hover:underline">
                {isLoginMode ? '회원가입' : '로그인'}
              </button>
              <button type="button" onClick={() => {
                setShowFindUsername(true);
                setMessage({ text: '', type: '' });
              }} className="text-green-700 hover:underline">
                아이디 찾기
              </button>
            </div>
          </form>
        )}

        {/* 아이디 찾기 폼만 보이는 경우 */}
        {showFindUsername && (
          <>
            <form onSubmit={handleFindUsername} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">가입 시 사용한 이메일</label>
                <input type="email" value={findUsernameEmail} onChange={(e) => setFindUsernameEmail(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md shadow-sm sm:text-sm" placeholder="example@email.com" required />
              </div>
              <button type="submit" className="w-full bg-green-600 text-white py-2.5 rounded-md font-semibold hover:bg-green-700">
                아이디 찾기
              </button>
              <button type="button" onClick={() => {
                setShowFindUsername(false);
                setFindUsernameEmail('');
                setFoundUsername('');
                setFindUsernameError('');
              }} className="w-full text-gray-600 mt-2 text-sm hover:underline">
                ← 로그인으로 돌아가기
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
          </>
        )}
      </div>
    </div>
  );
}

export default AuthPage;
