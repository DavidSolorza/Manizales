import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import ListingDetailPage from './pages/ListingDetailPage'
import CreateListingPage from './pages/CreateListingPage'

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/listings/:id" element={<ListingDetailPage />} />
        <Route path="/create" element={<CreateListingPage />} />
      </Routes>
    </div>
  )
}
