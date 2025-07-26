import React from 'react';
import { AuthProvider } from './context/AuthContext'; // AuthProvider 임포트
import AuthPage from './pages/AuthPage'; // AuthPage 임포트

function App() {
    return (
        // AuthProvider로 앱 전체를 감싸서 인증 상태를 제공합니다.
        <AuthProvider>
            <AuthPage /> {/* 인증 페이지를 렌더링 */}
            {/* 여기에 다른 라우트나 컴포넌트가 추가될 수 있습니다. */}
        </AuthProvider>
    );
}

export default App;