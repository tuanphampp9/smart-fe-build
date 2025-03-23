'use client'
import { logout } from '@/apiRequest/authApi'
import { baseMenu } from '@/lib/types/commonType'
import { StyledDrawer } from '@/styles/commonStyle'
import CircleIcon from '@mui/icons-material/Circle'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight'
import {
  Button,
  Collapse,
  List,
  ListItem,
  ListItemIcon,
  Stack,
  Typography,
  useMediaQuery,
} from '@mui/material'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
export interface ISidebarProps {
  menu: baseMenu[]
}
const Sidebar = (props: ISidebarProps) => {
  const { menu } = props
  const [openItems, setOpenItems] = useState<any>({})
  const isTablet = useMediaQuery('(max-width:1280px)')
  const dispatch = useDispatch()
  const router = useRouter()
  const pathName = usePathname()

  useEffect(() => {
    menu.forEach((item: any) => {
      if (item.subMenuItems) {
        item.subMenuItems.forEach((child: any) => {
          if (child.path === pathName) {
            setOpenItems((prevOpenItems: any) => ({
              ...prevOpenItems,
              [item.id]: true,
            }))
          }
        })
      }
    })
  }, [pathName])

  const handleClickItem = async (id: number, path: string) => {
    setOpenItems((prevOpenItems: any) => ({
      [id]: !prevOpenItems[id],
    }))
  }
  const handleClickChild = async (id: number) => {
    setOpenItems((prevOpenItems: any) => ({
      ...prevOpenItems,
      [id]: !prevOpenItems[id],
    }))
  }

  const handleLogout = async () => {
    localStorage.removeItem('token')
    await logout()
    toast.success('Đăng xuất thành công')
    router.push('/login')
  }
  return (
    <StyledDrawer
      variant='permanent'
      anchor='left'
      sx={{
        '& .MuiPaper-root': {
          width: isTablet ? '250px' : '15%',
        },
      }}
    >
      <List>
        {menu.map((item: any, index: number) => (
          <React.Fragment key={item.id}>
            <div
              onClick={async (e: any) => {
                if (!item.path) {
                  e.preventDefault()
                }
                if (item.path) {
                  router.push(item.path)
                  return
                }
                if (item.subMenu) {
                  const isActiveSubMenu = item.subMenuItems?.some(
                    (item: any) => item.path === pathName
                  )
                  if (isActiveSubMenu) {
                    await handleClickChild(item.id)
                  } else {
                    router.push(`${item.subMenuItems[0].path}`)
                  }
                } else {
                  await handleClickItem(item.id, item.path)
                }
              }}
            >
              <ListItem
                className={`cursor-pointer !py-3 flex justify-between !w-full 
                    ${pathName === item.path ? 'bg-blue-700' : ''}
                  `}
              >
                <Typography
                  variant='body1'
                  fontWeight={400}
                  className='!text-white flex-1'
                >
                  {item.title}
                </Typography>
                {item?.subMenuItems && (
                  <ListItemIcon>
                    {openItems[item.id] ? (
                      <KeyboardArrowDownIcon
                        fontSize='small'
                        className='text-white'
                      />
                    ) : (
                      <KeyboardArrowRightIcon
                        fontSize='small'
                        className='text-white'
                      />
                    )}
                  </ListItemIcon>
                )}
              </ListItem>
            </div>
            {item.subMenuItems && (
              <Collapse in={openItems[item.id]} timeout='auto' unmountOnExit>
                <List component='div' disablePadding>
                  {item.subMenuItems.map((child: any) => (
                    <Link
                      key={child.id}
                      href={child.path}
                      onClick={(e: any) => {
                        e.stopPropagation()
                      }}
                    >
                      <ListItem
                        className={`cursor-pointer !py-3 ${
                          pathName === child.path ? 'bg-blue-700' : ''
                        }`}
                      >
                        <ListItemIcon>
                          <CircleIcon fontSize='small' className='text-white' />
                        </ListItemIcon>
                        <Stack direction='row'>
                          <Typography
                            variant='body1'
                            fontWeight={400}
                            className='!text-white'
                          >
                            {child.title}
                          </Typography>
                        </Stack>
                      </ListItem>
                    </Link>
                  ))}
                </List>
              </Collapse>
            )}
          </React.Fragment>
        ))}
      </List>
      <div className='mt-3 border-t border-gray-500'>
        <Button onClick={handleLogout} className='!text-white !ml-3'>
          Đăng xuất
        </Button>
      </div>
    </StyledDrawer>
  )
}

export default Sidebar
