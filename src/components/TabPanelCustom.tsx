import * as React from 'react'
import Box from '@mui/material/Box'
import Tab from '@mui/material/Tab'
import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'

export interface ITabPanelCustomProps {
  listTabs: any[]
}
export default function TabPanelCustom(props: ITabPanelCustomProps) {
  const { listTabs } = props
  const [value, setValue] = React.useState('1')

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue)
  }

  return (
    <Box sx={{ width: '100%', typography: 'body1' }}>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList onChange={handleChange} aria-label='lab API tabs example'>
            {listTabs.map((tab, index) => (
              <Tab key={index} label={tab.label} value={tab.value} />
            ))}
          </TabList>
        </Box>
        {listTabs.map((tab, index) => (
          <TabPanel key={index} value={tab.value}>
            {tab.content}
          </TabPanel>
        ))}
      </TabContext>
    </Box>
  )
}
