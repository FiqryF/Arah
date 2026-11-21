import { RouterProvider } from 'react-router-dom'
import { Preferences } from './app/providers/Preferences'
import { makeRouter } from './app/router/routes'
const router = makeRouter()
export default function App() { return <Preferences><RouterProvider router={router}/></Preferences> }
