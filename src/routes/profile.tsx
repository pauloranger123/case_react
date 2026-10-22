
import { createFileRoute } from '@tanstack/react-router'
import ProfileLayout from '../components/ProfileLayout'

export const Route = createFileRoute('/profile')({
  component: ProfileLayout,
})
