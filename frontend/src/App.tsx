import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthPage from "./pages/AuthPage/AuthPage.tsx";
import ForumPage from "./pages/ForumPage/ForumPage.tsx";
import TopicPage from "./pages/TopicPage/TopicPage.tsx"
import PostPage from "./pages/PostPage/PostPage.tsx";

import ProtectedRoutes from "./utils/ProtectedRoutes.tsx";

function App() {
  return (
    <Router basename="/KForum">
      <Routes>
        <Route path="/auth" element={<AuthPage />} />
        <Route element = {<ProtectedRoutes/>}>
          <Route path="/topic/:topicID/:topicTitle" element={<TopicPage/>}></Route>
          <Route path="/post/:postID/:postTitle" element={<PostPage/>}></Route>
          <Route path="/" element={<ForumPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
