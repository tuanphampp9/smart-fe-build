import RenderBorrowSlip from './_components/RenderBorrowSlip'

export interface IBorrowSlipDetailProps {
  params: Promise<{ id: string }>
}

export default async function BorrowSlipDetail(props: IBorrowSlipDetailProps) {
  const params = await props.params
  const id = await params.id
  return <RenderBorrowSlip borrowSlipId={id} />
}
