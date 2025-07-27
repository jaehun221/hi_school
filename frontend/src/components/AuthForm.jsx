import React, { useState } from 'react';

// AuthForm Component: Renders the login and signup form.
// onSubmit: Function to be called on form submission.
// isSignup: Boolean indicating if the current mode is signup or login.
function AuthForm({ onSubmit, isSignup }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [nickname, setNickname] = useState(''); // Used only for signup

    // Form submission handler
    const handleSubmit = (e) => {
        e.preventDefault(); // Prevent default form submission behavior
        // Call the onSubmit function from the parent component
        onSubmit({ email, password, nickname });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* 이메일 입력 필드 */}
            <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                    이메일
                </label>
                <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 ease-in-out text-gray-800 placeholder-gray-400"
                    placeholder="your.email@example.com"
                />
            </div>

            {/* 비밀번호 입력 필드 */}
            <div>
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                    비밀번호
                </label>
                <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 ease-in-out text-gray-800 placeholder-gray-400"
                    placeholder="8자 이상 20자 이하"
                />
            </div>

            {/* 회원가입 모드일 경우 닉네임 입력 필드 표시 */}
            {isSignup && (
                <div>
                    <label htmlFor="nickname" className="block text-sm font-semibold text-gray-700 mb-2">
                        닉네임
                    </label>
                    <input
                        type="text"
                        id="nickname"
                        value={nickname}
                        onChange={(e) => setNickname(e.target.value)}
                        required={isSignup} // 회원가입 시에만 필수
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 ease-in-out text-gray-800 placeholder-gray-400"
                        placeholder="2자 이상 10자 이하"
                    />
                </div>
            )}

            {/* 제출 버튼 */}
            <button
                type="submit"
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-6 rounded-lg text-lg font-bold shadow-lg hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-300 ease-in-out transform hover:scale-105"
            >
                {isSignup ? '회원가입' : '로그인'}
            </button>
        </form>
    );
}

export default AuthForm;
