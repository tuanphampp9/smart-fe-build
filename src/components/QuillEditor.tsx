import 'react-quill-new/dist/quill.snow.css'
import dynamic from 'next/dynamic'
import { useCallback, useEffect, useRef } from 'react'
import { uploadImage } from '@/apiRequest/commonApi'
import { Typography } from '@mui/material'

const ReactQuill = dynamic(
  async () => {
    const { default: RQ } = await import('react-quill-new')

    return ({ forwardedRef, ...props }: any) => (
      <RQ ref={forwardedRef} {...props} />
    )
  },
  {
    ssr: false,
  }
)
interface QuillEditorProps {
  textError: string
  onChange: (content: string) => void
  value: string
}

const QuillEditor: React.FC<QuillEditorProps> = ({
  textError,
  onChange,
  value,
}) => {
  const editorRef = useRef<any>(null)
  const imageHandler = useCallback(() => {
    const quill = editorRef.current.getEditor()
    const range = quill.getSelection()

    //create input to select file image
    const input = document.createElement('input')
    input.setAttribute('type', 'file')
    input.setAttribute('accept', 'image/*')
    input.click()

    //when user select image
    input.onchange = async () => {
      const file = input.files![0]
      console.log(file)
      //save image to server
      const formData = new FormData()
      formData.append('image', file)
      const res = await uploadImage(file, 'posts')
      //insert image to editor
      quill.insertEmbed(range.index, 'image', res.data.url)
    }
  }, [])
  const modules = {
    toolbar: {
      container: [
        [{ header: [1, 2, 3, 4, 5, false] }],
        [{ color: [] }, { background: [] }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [{ align: [] }],
        [
          { list: 'ordered' },
          { list: 'bullet' },
          { inherit: -1 },
          { indent: '+1' },
        ],
        ['link', 'image'],
        ['clean'],
        ['code-block'],
      ],
      handlers: {
        image: imageHandler,
      },
    },
    clipboard: {
      // toggle to add extra line breaks when pasting HTML:
      matchVisual: false,
    },
  }

  const formats = [
    'header',
    'bold',
    'italic',
    'underline',
    'strike',
    'blockquote',
    'list',
    'indent',
    'link',
    'image',
    'color',
    'background',
    'align',
    'code-block',
  ]

  return (
    <div>
      <ReactQuill
        theme='snow'
        value={value}
        onChange={(content: string) => {
          onChange(content)
        }}
        modules={modules}
        formats={formats}
        style={{ minHeight: 300 }}
        forwardedRef={editorRef}
      />
      <Typography
        className='!text-red-500 !mt-14'
        variant='caption'
        component='div'
      >
        {textError}
      </Typography>
    </div>
  )
}

export default QuillEditor
