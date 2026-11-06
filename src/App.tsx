import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import HomeLandingPage from './app/page';
import SanctuaryStudioPage from './app/studio/page';
import SanctuaryVisitorPage from './app/sanctuary/[id]/page';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* 1. / (홈 랜딩 페이지) */}
        <Route path="/" element={<HomeLandingPage />} />

        {/* 2. /studio (추모관 편집기) */}
        <Route path="/studio" element={<SanctuaryStudioPage />} />

        {/* 3. /sanctuary/[id] (방문객용 실제 추모관) */}
        <Route path="/sanctuary/:id" element={<SanctuaryVisitorPage />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
