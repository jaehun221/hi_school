// src/firebase/firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// ⭐ 중요: 여기에 실제 Firebase 프로젝트 설정을 입력하세요!
// Firebase 콘솔 > 프로젝트 설정 > 일반 > 앱 추가 > 웹 앱 설정 시 나오는 객체
const firebaseConfig = {
    apiKey: "AIzaSyDDR4r_xdh8CeX1gPqy98cXgh7ICBjFL2M",
    authDomain: "hischool-17ded.firebaseapp.com",
    projectId: "hischool-17ded",
    storageBucket: "hischool-17ded.firebasestorage.app",
    messagingSenderId: "415054410234",
    appId: "1:415054410234:web:7a61aa90b1df3f04313443",
    measurementId: "G-RKG2X73X81"
};

// Firebase 앱 초기화
const app = initializeApp(firebaseConfig);

// Firebase Authentication 서비스 인스턴스 가져오기
const auth = getAuth(app);

// 다른 Firebase 서비스도 필요하다면 여기서 초기화하여 export 할 수 있습니다.
// 예: import { getFirestore } from 'firebase/firestore';
// export const db = getFirestore(app);

export { app, auth };