import { createBrowserRouter } from 'react-router-dom'
import { RootLayout } from './components/RootLayout'
import { HomePage } from './routes/HomePage'
import { ConferencesPage } from './routes/ConferencesPage'
import { ConferencePage } from './routes/ConferencePage'
import { TalkPage } from './routes/TalkPage'
import { SpeakersPage } from './routes/SpeakersPage'
import { SpeakerProfilePage } from './routes/SpeakerProfilePage'
import { FriendsPage } from './routes/FriendsPage'
import { FriendProfilePage } from './routes/FriendProfilePage'
import { AccountPage } from './routes/AccountPage'
import { ShopPage } from './routes/ShopPage'

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        path: '/',
        element: <HomePage />,
      },
      {
        path: '/conferences',
        element: <ConferencesPage />,
      },
      {
        path: '/conferences/:conferenceId',
        element: <ConferencePage />,
      },
      {
        path: '/talks/:talkId',
        element: <TalkPage />,
      },
      {
        path: '/speakers',
        element: <SpeakersPage />,
      },
      {
        path: '/speakers/:speakerId',
        element: <SpeakerProfilePage />,
      },
      {
        path: '/friends',
        element: <FriendsPage />,
      },
      {
        path: '/friends/:friendId',
        element: <FriendProfilePage />,
      },
      {
        path: '/account',
        element: <AccountPage />,
      },
      {
        path: '/shop',
        element: <ShopPage />,
      },
    ],
  },
])
