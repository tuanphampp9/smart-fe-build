import * as React from 'react'
import RenderDetail from './_components/RenderDetail'

export interface IPostDetailProps {
  params: Promise<{ id: string }>
}

export default async function PostDetail(props: IPostDetailProps) {
  const params = await props.params
  const id = await params.id
  const words = id.split('.html')
  const prefix = words[0].split('-')
  const postId = prefix[prefix.length - 1]
  return <RenderDetail postId={postId} />
}
