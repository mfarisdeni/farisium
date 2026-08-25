'use client'

import {
  createContext,
  useContext,
  useCallback,
  useState,
  useMemo,
  useRef,
  useEffect,
  type ReactNode,
} from 'react'
import {
  addTempImage,
  getTempImages,
  removeTempImage,
  subscribeTempGallery,
} from '@/lib/tempGallery'

export interface GalleryImage {
  id: string
  url: string
  prompt: string
  createdAt: number
}

interface GalleryContextValue {
  images: GalleryImage[]
  addImage: (id: string, base64: string, prompt: string) => void
  removeImage: (id: string) => void
}

const GalleryContext = createContext<GalleryContextValue | null>(null)

export function useGalleryContext() {
  const ctx = useContext(GalleryContext)
  if (!ctx) throw new Error('useGalleryContext must be used within GalleryProvider')
  return ctx
}

export function GalleryProvider({ children }: { children: ReactNode }) {
  const [version, setVersion] = useState(0)
  const versionRef = useRef(version)
  versionRef.current = version

  useEffect(() => {
    return subscribeTempGallery(() => {
      setVersion((v) => v + 1)
    })
  }, [])

  const images = useMemo(() => getTempImages() as GalleryImage[], [version])

  const addImage = useCallback((id: string, base64: string, prompt: string) => {
    addTempImage(id, base64, prompt)
    setVersion((v) => v + 1)
  }, [])

  const removeImage = useCallback((id: string) => {
    removeTempImage(id)
    setVersion((v) => v + 1)
  }, [])

  return (
    <GalleryContext.Provider value={{ images, addImage, removeImage }}>
      {children}
    </GalleryContext.Provider>
  )
}
