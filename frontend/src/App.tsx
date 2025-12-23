import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import AuthPage from "./pages/AuthPage/AuthPage.tsx";
import ForumPage from "./pages/ForumPage/ForumPage.tsx";
import TopicPage from "./pages/TopicPage/TopicPage.tsx"

import ProtectedRoutes from "./utils/ProtectedRoutes.tsx";

function App() {
  return (
    <Router basename="/KForum">
      <Routes>
        <Route path="/auth" element={<AuthPage />} />
        <Route element = {<ProtectedRoutes/>}>
          <Route path="/topic/:topic" element={<TopicPage/>}></Route>
          <Route path="/" element={<ForumPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
