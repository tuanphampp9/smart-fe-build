import RenderDetail from './_components/RenderDetail'

export interface IPublicationDetailProps {
  params: Promise<{ id: string }>
}

export default async function PublicationDetail(
  props: IPublicationDetailProps
) {
  const params = await props.params
  const id = await params.id
  const words = id.split('.html')
  const prefix = words[0].split('-')
  const publicationId = prefix[prefix.length - 1]
  return <RenderDetail publicationId={publicationId} />
}
