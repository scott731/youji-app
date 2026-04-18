import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Friends from './pages/Friends'
import FriendDetail from './pages/FriendDetail'
import FriendEdit from './pages/FriendEdit'
import Events from './pages/Events'
import Me from './pages/Me'

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/friends" element={<Friends />} />
        <Route path="/friends/new" element={<FriendEdit />} />
        <Route path="/friends/:id" element={<FriendDetail />} />
        <Route path="/friends/:id/edit" element={<FriendEdit />} />
        <Route path="/events" element={<Events />} />
        <Route path="/me" element={<Me />} />
      </Routes>
    </Layout>
  )
}
