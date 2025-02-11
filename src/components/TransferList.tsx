import * as React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Grid from '@mui/material/Grid'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Checkbox from '@mui/material/Checkbox'
import Paper from '@mui/material/Paper'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import toast from 'react-hot-toast'
import Spinner from 'src/@core/components/spinner'

import { AppDispatch } from 'src/store'
import { getRoleFeaturesData, createRoleFeaturesData, deleteRoleFeaturesData } from 'src/store/apps/rolefeatures'

function not(a: any[], b: any[]) {
  return a.filter(value => !b.includes(value))
}

function intersection(a: any[], b: any[]) {
  return a.filter(value => b.includes(value))
}

export default function TransferList({ features, role, modalClose }: { features: any; role: any; modalClose: any }) {
  const dispatch = useDispatch<AppDispatch>()
  const [checked, setChecked] = React.useState<any[]>([])
  const [left, setLeft] = React.useState<any[]>([])
  const [right, setRight] = React.useState<any[]>([])
  const [loading, setLoading] = React.useState<boolean>(true)

  React.useEffect(() => {
    setLeft(features.rows)
    dispatch(
      getRoleFeaturesData({
        where: [{ column: '"Role"."id"', operator: '=', value: role.id }],
        joins: [{ column: 'Role' }, { column: 'Feature' }]
      })
    ).then((res: any) => {
      const featureData = res?.payload?.data?.map((value: any) => {
        return {
          id: value.feature.feature_id,
          name: value.feature.feature_name,
          created_at: value.feature.created_at,
          updated_at: value.feature.updated_at,
          Deleted_at: value.feature.Deleted_at
        }
      })
      const filtereData = features?.rows?.filter(large => !featureData?.some(small => large.id === small.id))
      setLeft(filtereData)
      setRight(featureData)
      setLoading(false)
    })
  }, [])

  const handleSubmit = async () => {
    const payload: any = []
    const userData: any = JSON.parse(window.localStorage.getItem('userData'))
    right.map(data => {
      const tenant_id = userData.tenant_id
      payload.push({
        tenant_id,
        role_id: role.id,
        feature_id: data.id
      })
    })

    const del = await dispatch(deleteRoleFeaturesData({ role_id: role.id }))
    if (del.error) {
      toast.error(`failed to create rolefeatures Try Again!`)

      return
    }
    const res = await dispatch(createRoleFeaturesData(payload))
    if (res.error) {
      toast.error(`failed to create rolefeatures Try Again!`)

      return
    }
    toast.success(`Role features updated successfully!`)
    modalClose()
  }
  const leftChecked = intersection(checked, left)
  const rightChecked = intersection(checked, right)

  const handleToggle = (value: number) => () => {
    const currentIndex = checked.indexOf(value)
    const newChecked = [...checked]

    if (currentIndex === -1) {
      newChecked.push(value)
    } else {
      newChecked.splice(currentIndex, 1)
    }

    setChecked(newChecked)
  }

  const handleAllRight = () => {
    setRight(right.concat(left))
    setLeft([])
  }

  const handleCheckedRight = () => {
    setRight(right.concat(leftChecked))
    setLeft(not(left, leftChecked))
    setChecked(not(checked, leftChecked))
  }

  const handleCheckedLeft = () => {
    setLeft(left.concat(rightChecked))
    setRight(not(right, rightChecked))
    setChecked(not(checked, rightChecked))
  }

  const handleAllLeft = () => {
    setLeft(left.concat(right))
    setRight([])
  }

  const customList = (items: any[]) => (
    <Paper sx={{ width: 200, height: 230, overflow: 'auto' }}>
      <List dense component='div' role='list'>
        {items.map((value: any) => {
          const labelId = `transfer-list-item-${value}-label`

          return (
            <ListItemButton key={value.id} role='listitem' onClick={handleToggle(value)}>
              <ListItemIcon>
                <Checkbox
                  checked={checked.includes(value)}
                  tabIndex={-1}
                  disableRipple
                  inputProps={{
                    'aria-labelledby': labelId
                  }}
                />
              </ListItemIcon>
              <ListItemText id={labelId} primary={`${value.name}`} />
            </ListItemButton>
          )
        })}
      </List>
    </Paper>
  )

  return (
    <>
      {loading ? (
        <Spinner />
      ) : (
        <Grid container spacing={2} sx={{ justifyContent: 'center', alignItems: 'center' }}>
          <Grid item>{customList(left)}</Grid>
          <Grid item>
            <Grid container direction='column' sx={{ alignItems: 'center' }}>
              <Button
                sx={{ my: 0.5 }}
                variant='outlined'
                size='small'
                onClick={handleAllRight}
                disabled={left.length === 0}
                aria-label='move all right'
              >
                ≫
              </Button>
              <Button
                sx={{ my: 0.5 }}
                variant='outlined'
                size='small'
                onClick={handleCheckedRight}
                disabled={leftChecked.length === 0}
                aria-label='move selected right'
              >
                &gt;
              </Button>
              <Button
                sx={{ my: 0.5 }}
                variant='outlined'
                size='small'
                onClick={handleCheckedLeft}
                disabled={rightChecked.length === 0}
                aria-label='move selected left'
              >
                &lt;
              </Button>
              <Button
                sx={{ my: 0.5 }}
                variant='outlined'
                size='small'
                onClick={handleAllLeft}
                disabled={right.length === 0}
                aria-label='move all left'
              >
                ≪
              </Button>
            </Grid>
          </Grid>
          <Grid item>{customList(right)}</Grid>

          <Grid container spacing={2} sx={{ mt: 4, justifyContent: 'center', alignItems: 'center' }}>
            <Box className='demo-space-x'>
              <Button size='large' onClick={handleSubmit} variant='contained'>
                Submit
              </Button>
            </Box>
          </Grid>
        </Grid>
      )}
    </>
  )
}
